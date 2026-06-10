import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { Card, Button, Select, Space, Tag, FloatButton } from 'antd'
import { PlayCircleOutlined, ReloadOutlined, BookOutlined, CloseOutlined, ExpandOutlined, CompressOutlined } from '@ant-design/icons'
import { executeApi } from '../../api/execute'

interface PracticeProblem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  defaultCode: string
  guide: string
}

const problems: PracticeProblem[] = [
  {
    id: 'p1',
    title: '实现一个栈',
    difficulty: 'easy',
    description: '实现一个 Stack 类，支持 push(x) 入栈、pop() 出栈、peek() 查看栈顶元素、is_empty() 判空。',
    defaultCode: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self.items.pop()

    def peek(self):
        return self.items[-1] if self.items else None

    def is_empty(self):
        return len(self.items) == 0

# 测试
s = Stack()
s.push(1)
s.push(2)
s.push(3)
print(s.pop())   # 应输出 3
print(s.peek())  # 应输出 2
print(s.is_empty())  # 应输出 False`,
    guide: `# 栈的实现指导

## 什么是栈？

栈是一种**后进先出**（LIFO）的数据结构，就像一叠盘子：
- 放盘子只能从最上面放（push）
- 取盘子只能从最上面取（pop）

## 实现思路

1. 用 Python 列表存储数据
2. \`push(x)\`：用 \`append\` 把元素加到末尾
3. \`pop()\`：用 \`pop()\` 移除末尾元素（注意判空）
4. \`peek()\`：取末尾元素但不移除
5. \`is_empty()\`：判断列表是否为空

## 常见错误

- 忘记判空就 pop，会抛 IndexError
- peek 时直接用 \`self.items[-1]\`，空列表会报错

## 验证方法

按题目给的测试用例运行，输出应为：
\`\`\`
3
2
False
\`\`\``,
  },
  {
    id: 'p2',
    title: '实现一个队列',
    difficulty: 'easy',
    description: '实现一个 Queue 类，支持 enqueue(x) 入队、dequeue() 出队、front() 查看队头、is_empty() 判空。',
    defaultCode: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, x):
        self.items.append(x)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("dequeue from empty queue")
        return self.items.popleft()

    def front(self):
        return self.items[0] if self.items else None

    def is_empty(self):
        return len(self.items) == 0

# 测试
q = Queue()
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
print(q.dequeue())  # 应输出 10
print(q.front())    # 应输出 20
print(q.is_empty()) # 应输出 False`,
    guide: `# 队列的实现指导

## 什么是队列？

队列是一种**先进先出**（FIFO）的数据结构，就像排队买票：
- 新人排到队尾（enqueue）
- 办完的人从队首离开（dequeue）

## 实现思路

1. 推荐使用 \`collections.deque\`，它比列表的 \`pop(0)\` 效率高
2. \`enqueue(x)\`：\`append(x)\`
3. \`dequeue()\`：\`popleft()\`（注意判空）
4. \`front()\`：取第一个元素

## 为什么不用列表？

列表的 \`pop(0)\` 时间复杂度是 O(n)，因为所有元素都要左移一位。
\`deque\` 的 \`popleft()\` 是 O(1)。

## 验证输出

\`\`\`
10
20
False
\`\`\``,
  },
  {
    id: 'p3',
    title: '单链表反转',
    difficulty: 'medium',
    description: '给定一个单链表的头节点，请将其反转并返回新的头节点。',
    defaultCode: `class Node:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    cur = head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev

# 构建链表 1 -> 2 -> 3
c = Node(3)
b = Node(2, c)
a = Node(1, b)

new_head = reverse_list(a)
# 打印结果
cur = new_head
while cur:
    print(cur.val, end=' ')
    cur = cur.next
# 应输出 3 2 1`,
    guide: `# 单链表反转指导

## 核心思想：三指针法

用三个指针逐步反转指向关系：

\`\`\`
prev = None
cur = head

while cur:
    nxt = cur.next   # 先保存下一个节点
    cur.next = prev  # 反转当前节点的指向
    prev = cur       # prev 前移
    cur = nxt        # cur 前移
\`\`\`

## 图示

初始：1 → 2 → 3 → None

第1轮：None ← 1   2 → 3 → None
第2轮：None ← 1 ← 2   3 → None
第3轮：None ← 1 ← 2 ← 3

返回 prev，即新的头节点 3。

## 常见错误

- 没有保存 \`nxt\` 就改 \`cur.next\`，导致链表断开
- 最后返回 \`cur\` 而不是 \`prev\``,
  },
]

const difficultyMap = {
  easy: { text: '简单', color: 'success' as const },
  medium: { text: '中等', color: 'warning' as const },
  hard: { text: '困难', color: 'error' as const },
}

type PanelSize = 'small' | 'medium' | 'large'

const sizeConfig: Record<PanelSize, { width: number; height: number; label: string }> = {
  small: { width: 400, height: 320, label: '小' },
  medium: { width: 600, height: 480, label: '中' },
  large: { width: 800, height: 640, label: '大' },
}

export default function Practice() {
  const [currentId, setCurrentId] = useState(problems[0].id)
  const currentProblem = problems.find((p) => p.id === currentId) || problems[0]

  const [code, setCode] = useState(currentProblem.defaultCode)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)

  // 悬浮面板状态
  const [guideOpen, setGuideOpen] = useState(false)
  const [guideSize, setGuideSize] = useState<PanelSize>('medium')

  const handleChangeProblem = useCallback(
    (id: string) => {
      setCurrentId(id)
      const p = problems.find((x) => x.id === id)
      if (p) setCode(p.defaultCode)
      setOutput('')
    },
    []
  )

  const handleRun = async () => {
    setRunning(true)
    setOutput('')
    try {
      const res = await executeApi.run({ code })
      const parts: string[] = []
      if (res.data.stdout) parts.push(res.data.stdout)
      if (res.data.stderr) parts.push('[stderr]\n' + res.data.stderr)
      if (res.data.exit_code !== 0 && !res.data.stderr) {
        parts.push(`(exit code: ${res.data.exit_code})`)
      }
      setOutput(parts.join('\n') || '（程序运行结束，无输出）')
    } catch (err: any) {
      const detail = err.response?.data?.detail || err.message || '执行失败'
      setOutput('[Error] ' + detail)
    } finally {
      setRunning(false)
    }
  }

  const handleReset = () => {
    setCode(currentProblem.defaultCode)
    setOutput('')
  }

  const toggleSize = () => {
    setGuideSize((prev) => {
      if (prev === 'small') return 'medium'
      if (prev === 'medium') return 'large'
      return 'small'
    })
  }

  const size = sizeConfig[guideSize]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>代码实操</h2>
        <Select
          value={currentId}
          onChange={handleChangeProblem}
          style={{ width: 240 }}
          options={problems.map((p) => ({
            value: p.id,
            label: (
              <span>
                {p.title}
                <Tag color={difficultyMap[p.difficulty].color} style={{ marginLeft: 8 }}>
                  {difficultyMap[p.difficulty].text}
                </Tag>
              </span>
            ),
          }))}
        />
      </div>

      {/* 题目描述 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <strong>{currentProblem.title}</strong>
          <Tag color={difficultyMap[currentProblem.difficulty].color}>
            {difficultyMap[currentProblem.difficulty].text}
          </Tag>
        </div>
        <p style={{ margin: 0, color: '#555' }}>{currentProblem.description}</p>
      </Card>

      {/* 编辑器 + 输出 */}
      <div style={{ display: 'flex', gap: 24 }}>
        <Card
          title="编辑器（Python）"
          style={{ flex: 1 }}
          extra={
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleRun}
                loading={running}
              >
                运行
              </Button>
            </Space>
          }
        >
          <Editor
            height={420}
            language="python"
            theme="vs-light"
            value={code}
            onChange={(v) => setCode(v || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
        </Card>

        <Card
          title="运行结果"
          style={{ flex: 1 }}
          bodyStyle={{ padding: 0 }}
        >
          <div
            style={{
              height: 420,
              overflow: 'auto',
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: 16,
              fontFamily: 'monospace',
              fontSize: 14,
              whiteSpace: 'pre-wrap',
            }}
          >
            {running ? (
              <div style={{ color: '#888', textAlign: 'center', marginTop: 160 }}>
                正在运行...
              </div>
            ) : output ? (
              output
            ) : (
              <div style={{ color: '#888', textAlign: 'center', marginTop: 160 }}>
                点击"运行"执行代码
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 悬浮讲义面板 */}
      {guideOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            width: size.width,
            height: size.height,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            transition: 'width 0.2s, height 0.2s',
          }}
        >
          {/* 面板标题栏 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#1890ff',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOutlined />
              操作指导
            </span>
            <Space size={4}>
              <Button
                type="text"
                size="small"
                style={{ color: '#fff' }}
                icon={guideSize === 'large' ? <CompressOutlined /> : <ExpandOutlined />}
                onClick={toggleSize}
              >
                {size.label}
              </Button>
              <Button
                type="text"
                size="small"
                style={{ color: '#fff' }}
                icon={<CloseOutlined />}
                onClick={() => setGuideOpen(false)}
              />
            </Space>
          </div>

          {/* 面板内容 */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: 16,
              lineHeight: 1.8,
              fontSize: 14,
              whiteSpace: 'pre-wrap',
            }}
          >
            {currentProblem.guide}
          </div>
        </div>
      )}

      {/* 浮动按钮 */}
      {!guideOpen && (
        <FloatButton
          icon={<BookOutlined />}
          tooltip="查看操作指导"
          onClick={() => setGuideOpen(true)}
          style={{ right: 24, bottom: 24 }}
        />
      )}
    </div>
  )
}

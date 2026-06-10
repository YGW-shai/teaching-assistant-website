import { useState, useMemo, useEffect } from 'react'
import { Card, Tree, Button, Progress, Tag, Empty } from 'antd'
import { CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import type { KnowledgePoint } from '../../types'

// Mock 课程数据：数据结构
const mockCourseData = {
  id: 'ds101',
  title: '数据结构与算法',
  chapters: [
    {
      id: 'ch1',
      title: '第1章 绪论',
      children: [
        {
          id: 'ch1-1',
          title: '1.1 什么是数据结构',
          content: `# 1.1 什么是数据结构

数据结构是计算机存储、组织数据的方式，指相互之间存在一种或多种特定关系的数据元素的集合。

## 基本概念

- **数据**：描述客观事物的符号，是计算机中可以操作的对象
- **数据元素**：组成数据的基本单位
- **数据项**：构成数据元素的最小单位
- **数据对象**：性质相同的数据元素的集合

## 逻辑结构

1. 集合结构：元素间只有"同属一个集合"的关系
2. 线性结构：元素间一对一的关系
3. 树形结构：元素间一对多的关系
4. 图形结构：元素间多对多的关系

## 物理结构（存储结构）

- 顺序存储：把数据元素存放在地址连续的存储单元里
- 链式存储：把数据元素存放在任意的存储单元里，用指针关联`,
        },
        {
          id: 'ch1-2',
          title: '1.2 算法与复杂度',
          content: `# 1.2 算法与复杂度

算法是对特定问题求解步骤的一种描述，它是指令的有限序列。

## 算法的特性

1. **有穷性**：步骤有限
2. **确定性**：每一步都有明确的含义
3. **可行性**：每一步都能通过执行有限次数完成
4. **输入**：零个或多个输入
5. **输出**：至少一个输出

## 时间复杂度

用大 O 记号表示算法执行时间随问题规模增长的变化趋势：

- O(1)：常数阶
- O(log n)：对数阶
- O(n)：线性阶
- O(n log n)：线性对数阶
- O(n²)：平方阶

## 空间复杂度

算法执行过程中需要的辅助存储空间大小。`,
        },
      ],
    },
    {
      id: 'ch2',
      title: '第2章 线性表',
      children: [
        {
          id: 'ch2-1',
          title: '2.1 顺序表',
          content: `# 2.1 顺序表

顺序表是用一段地址连续的存储单元依次存储数据元素的线性结构。

## 特点

- 随机访问：通过下标 O(1) 访问任意元素
- 存储密度高：只存储数据本身
- 插入删除效率低：平均需要移动 n/2 个元素

## Python 示例

\`\`\`python
class SeqList:
    def __init__(self, capacity=10):
        self.data = [None] * capacity
        self.length = 0

    def insert(self, i, x):
        if self.length >= len(self.data):
            raise OverflowError
        for j in range(self.length, i, -1):
            self.data[j] = self.data[j-1]
        self.data[i] = x
        self.length += 1
\`\`\``,
        },
        {
          id: 'ch2-2',
          title: '2.2 单链表',
          content: `# 2.2 单链表

单链表是用一组任意的存储单元存储线性表的数据元素，每个节点包含数据域和指针域。

## 节点结构

\`
[ data | next ] → [ data | next ] → [ data | next ] → None
\`

## 特点

- 插入删除只需修改指针，O(1)
- 不支持随机访问，查找需要 O(n)
- 需要额外空间存储指针

## Python 示例

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        new = Node(data)
        if not self.head:
            self.head = new
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = new
\`\`\``,
        },
        {
          id: 'ch2-3',
          title: '2.3 双向链表',
          content: `# 2.3 双向链表

双向链表的每个节点有两个指针域，分别指向前驱和后继。

## 节点结构

\`
None ← [ prev | data | next ] ↔ [ prev | data | next ] ↔ [ prev | data | next ] → None
\`

## 优点

- 可以双向遍历
- 删除节点时不需要找前驱（已知该节点地址的情况下）
- 在特定场景下插入删除更方便

## Python 示例

\`\`\`python
class DNode:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None
\`\`\``,
        },
      ],
    },
    {
      id: 'ch3',
      title: '第3章 栈与队列',
      children: [
        {
          id: 'ch3-1',
          title: '3.1 栈',
          content: `# 3.1 栈

栈是只允许在一端进行插入或删除操作的线性表。

## 特点

- **后进先出**（LIFO, Last In First Out）
- 插入/删除的一端称为**栈顶**，另一端称为**栈底**

## 基本操作

- push(x)：入栈
- pop()：出栈
- peek()：取栈顶元素（不出栈）
- isEmpty()：判空

## Python 实现

\`\`\`python
class Stack:
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
\`\`\``,
        },
        {
          id: 'ch3-2',
          title: '3.2 队列',
          content: `# 3.2 队列

队列是只允许在一端进行插入、在另一端进行删除的线性表。

## 特点

- **先进先出**（FIFO, First In First Out）
- 插入端称为**队尾**，删除端称为**队头**

## 基本操作

- enqueue(x)：入队
- dequeue()：出队
- front()：取队头元素
- isEmpty()：判空

## Python 实现

\`\`\`python
from collections import deque

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
\`\`\``,
        },
      ],
    },
  ],
}

const STORAGE_KEY = 'course-learned-points'

function getAllKnowledgePoints(): KnowledgePoint[] {
  const points: KnowledgePoint[] = []
  mockCourseData.chapters.forEach((ch) => {
    ch.children.forEach((kp) => points.push(kp))
  })
  return points
}

export default function Course() {
  const allPoints = useMemo(() => getAllKnowledgePoints(), [])
  const [selectedKey, setSelectedKey] = useState<string>(allPoints[0]?.id || '')
  const [learnedSet, setLearnedSet] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return new Set<string>(saved ? JSON.parse(saved) : [])
    } catch {
      return new Set<string>()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...learnedSet]))
  }, [learnedSet])

  const selectedPoint = useMemo(
    () => allPoints.find((p) => p.id === selectedKey),
    [allPoints, selectedKey]
  )

  const isLearned = (id: string) => learnedSet.has(id)

  const toggleLearned = (id: string) => {
    setLearnedSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const progress = Math.round((learnedSet.size / allPoints.length) * 100)

  const treeData = useMemo(
    () =>
      mockCourseData.chapters.map((ch) => ({
        key: ch.id,
        title: ch.title,
        selectable: false,
        children: ch.children.map((kp) => ({
          key: kp.id,
          title: (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {kp.title}
              {isLearned(kp.id) && (
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: 14 }} />
              )}
            </span>
          ),
        })),
      })),
    [learnedSet]
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{mockCourseData.title}</h2>
        <Tag color="blue">必修</Tag>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 左侧目录 */}
        <Card
          title="课程目录"
          style={{ width: 320, flexShrink: 0 }}
          bodyStyle={{ padding: '12px 0' }}
        >
          <Tree
            treeData={treeData}
            selectedKeys={[selectedKey]}
            defaultExpandAll
            onSelect={(keys) => {
              if (keys[0] && String(keys[0]).startsWith('ch') && String(keys[0]).includes('-')) {
                setSelectedKey(String(keys[0]))
              }
            }}
          />
          <div style={{ padding: '16px 24px 0', borderTop: '1px solid #f0f0f0', marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: '#888' }}>学习进度</span>
              <span style={{ fontWeight: 600 }}>{learnedSet.size} / {allPoints.length}</span>
            </div>
            <Progress percent={progress} size="small" status={progress === 100 ? 'success' : 'active'} />
          </div>
        </Card>

        {/* 右侧内容 */}
        <Card
          title={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {selectedPoint?.title || '请选择一个知识点'}
              {selectedPoint && isLearned(selectedPoint.id) && (
                <Tag color="success" icon={<CheckCircleOutlined />}>已学会</Tag>
              )}
            </span>
          }
          extra={
            selectedPoint && (
              <Button
                type={isLearned(selectedPoint.id) ? 'default' : 'primary'}
                icon={<CheckCircleOutlined />}
                onClick={() => toggleLearned(selectedPoint.id)}
              >
                {isLearned(selectedPoint.id) ? '取消已学会' : '标记为已学会'}
              </Button>
            )
          }
          style={{ flex: 1 }}
        >
          {selectedPoint ? (
            <div
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                fontSize: 14,
                color: '#333',
              }}
            >
              {selectedPoint.content}
            </div>
          ) : (
            <Empty description="请在左侧选择一个知识点" />
          )}
        </Card>
      </div>
    </div>
  )
}

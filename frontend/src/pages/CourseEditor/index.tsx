import { useState, useMemo, useCallback } from 'react'
import { Card, Form, Input, Button, Tree, Popconfirm, Space, message } from 'antd'
import { PlusOutlined, SaveOutlined, DeleteOutlined, EditOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

interface TreeNodeData {
  key: string
  title: string
  content?: string
  children?: TreeNodeData[]
}

// Mock 初始数据
const initialTreeData: TreeNodeData[] = [
  {
    key: 'ch1',
    title: '第1章 绪论',
    children: [
      {
        key: 'ch1-1',
        title: '1.1 什么是数据结构',
        content: `# 1.1 什么是数据结构

数据结构是计算机存储、组织数据的方式。

## 基本概念

- **数据**：信息的载体
- **数据元素**：数据的基本单位
- **数据项**：构成数据元素的最小单位

## 常见数据结构

1. 数组
2. 链表
3. 栈
4. 队列
5. 树
6. 图`,
      },
      {
        key: 'ch1-2',
        title: '1.2 算法复杂度',
        content: `# 1.2 算法复杂度

算法是对特定问题求解步骤的一种描述。

## 时间复杂度

- O(1)：常数阶
- O(log n)：对数阶
- O(n)：线性阶
- O(n²)：平方阶`,
      },
    ],
  },
  {
    key: 'ch2',
    title: '第2章 线性表',
    children: [
      {
        key: 'ch2-1',
        title: '2.1 顺序表',
        content: `# 2.1 顺序表

顺序表是用一段地址连续的存储单元依次存储数据元素的线性结构。

## 特点

- 随机访问：O(1)
- 插入删除效率低：O(n)`,
      },
      {
        key: 'ch2-2',
        title: '2.2 单链表',
        content: `# 2.2 单链表

单链表是用一组任意的存储单元存储线性表的数据元素。`,
      },
    ],
  },
]

let keyCounter = 100

function generateKey(prefix: string) {
  keyCounter += 1
  return `${prefix}-${keyCounter}`
}

function findNode(tree: TreeNodeData[], key: string): TreeNodeData | null {
  for (const node of tree) {
    if (node.key === key) return node
    if (node.children) {
      const found = findNode(node.children, key)
      if (found) return found
    }
  }
  return null
}

function deleteNode(tree: TreeNodeData[], key: string): TreeNodeData[] {
  return tree
    .filter((n) => n.key !== key)
    .map((n) => (n.children ? { ...n, children: deleteNode(n.children, key) } : n))
}

function isChapterKey(key: string) {
  return !key.includes('-') || key.startsWith('newch')
}

export default function CourseEditor() {
  const [treeData, setTreeData] = useState<TreeNodeData[]>(initialTreeData)
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [editingTitle, setEditingTitle] = useState('')
  const [editingContent, setEditingContent] = useState('')

  const selectedNode = useMemo(() => {
    if (!selectedKey) return null
    return findNode(treeData, selectedKey)
  }, [treeData, selectedKey])

  // 当选中节点变化时，同步编辑表单
  const handleSelect = useCallback(
    (keys: React.Key[]) => {
      const key = keys[0] as string
      if (!key) return
      setSelectedKey(key)
      const node = findNode(treeData, key)
      if (node) {
        setEditingTitle(node.title)
        setEditingContent(node.content || '')
      }
    },
    [treeData]
  )

  const handleAddChapter = () => {
    const newKey = generateKey('newch')
    const newChapter: TreeNodeData = {
      key: newKey,
      title: `新章节`,
      children: [],
    }
    setTreeData((prev) => [...prev, newChapter])
    setSelectedKey(newKey)
    setEditingTitle(newChapter.title)
    setEditingContent('')
    message.success('已新增章节')
  }

  const handleAddKnowledgePoint = () => {
    if (!selectedKey) {
      message.warning('请先选中一个章节')
      return
    }
    const parentNode = findNode(treeData, selectedKey)
    if (!parentNode) return

    // 如果选中的是知识点，找到它的父章节
    let targetChapter = parentNode
    if (!isChapterKey(selectedKey)) {
      // 找到父章节
      for (const ch of treeData) {
        if (ch.children?.some((c) => c.key === selectedKey)) {
          targetChapter = ch
          break
        }
      }
    }

    const newKey = generateKey(targetChapter.key)
    const index = (targetChapter.children?.length || 0) + 1
    const newPoint: TreeNodeData = {
      key: newKey,
      title: `${targetChapter.title.replace('第', '').replace('章 ', '.')}${index} 新知识点`,
      content: '',
    }

    setTreeData((prev) =>
      prev.map((ch) =>
        ch.key === targetChapter.key
          ? { ...ch, children: [...(ch.children || []), newPoint] }
          : ch
      )
    )
    setSelectedKey(newKey)
    setEditingTitle(newPoint.title)
    setEditingContent('')
    message.success('已新增知识点')
  }

  const handleDelete = () => {
    if (!selectedKey) {
      message.warning('请先选中要删除的节点')
      return
    }
    setTreeData((prev) => deleteNode(prev, selectedKey))
    setSelectedKey('')
    setEditingTitle('')
    setEditingContent('')
    message.success('已删除')
  }

  const handleSave = () => {
    if (!selectedKey) {
      message.warning('请先选中一个节点')
      return
    }

    setTreeData((prev) =>
      prev.map((ch) => {
        if (ch.key === selectedKey) {
          return { ...ch, title: editingTitle, content: editingContent }
        }
        if (ch.children) {
          return {
            ...ch,
            children: ch.children.map((c) =>
              c.key === selectedKey
                ? { ...c, title: editingTitle, content: editingContent }
                : c
            ),
          }
        }
        return ch
      })
    )
    message.success('保存成功（Mock）')
  }

  const treeNodes: DataNode[] = useMemo(() => {
    const mapNode = (n: TreeNodeData): DataNode => ({
      key: n.key,
      title: n.title,
      icon: n.children ? <FolderOutlined /> : <FileOutlined />,
      children: n.children?.map(mapNode),
    })
    return treeData.map(mapNode)
  }, [treeData])

  const isChapter = selectedNode ? isChapterKey(selectedNode.key) : false

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h2 style={{ margin: 0 }}>课程编辑</h2>
          <p style={{ color: '#888', margin: '4px 0 0' }}>数据结构与算法 — 管理课程章节与知识点</p>
        </div>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          保存修改
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        {/* 左侧目录 */}
        <Card
          title="目录结构"
          style={{ width: 340, flexShrink: 0 }}
          bodyStyle={{ padding: '12px 0' }}
          extra={
            <Space size={4}>
              <Button type="text" size="small" icon={<PlusOutlined />} onClick={handleAddChapter}>
                章节
              </Button>
              <Button type="text" size="small" icon={<PlusOutlined />} onClick={handleAddKnowledgePoint}>
                知识点
              </Button>
              <Popconfirm
                title="确认删除？"
                description="删除后不可恢复"
                onConfirm={handleDelete}
                okText="删除"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" size="small" danger icon={<DeleteOutlined />} disabled={!selectedKey}>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          }
        >
          <Tree
            treeData={treeNodes}
            selectedKeys={[selectedKey]}
            defaultExpandAll
            onSelect={handleSelect}
            showIcon
          />
        </Card>

        {/* 右侧编辑 */}
        <Card
          title={
            <span>
              <EditOutlined style={{ marginRight: 8 }} />
              {selectedNode ? (isChapter ? '编辑章节' : '编辑知识点') : '内容编辑'}
            </span>
          }
          style={{ flex: 1 }}
        >
          {selectedNode ? (
            <Form layout="vertical">
              <Form.Item label="标题">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="请输入标题"
                />
              </Form.Item>

              {!isChapter && (
                <Form.Item label="讲义内容（Markdown）">
                  <Input.TextArea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={18}
                    placeholder="请输入 Markdown 格式的讲义内容"
                  />
                </Form.Item>
              )}

              {isChapter && (
                <div style={{ padding: 40, textAlign: 'center', color: '#888', background: '#f5f5f5', borderRadius: 8 }}>
                  章节节点仅可编辑标题，知识点内容请在子节点中编辑
                </div>
              )}
            </Form>
          ) : (
            <div style={{ padding: 80, textAlign: 'center', color: '#888' }}>
              请在左侧目录中选择一个章节或知识点进行编辑
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

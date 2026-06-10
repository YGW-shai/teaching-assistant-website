import { useState, useMemo, useEffect, useCallback } from 'react'
import { Card, Form, Input, Button, Tree, message, Space } from 'antd'
import { SaveOutlined, UploadOutlined, ExperimentOutlined, FileOutlined } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'
import { chapterApi, type Chapter, type KnowledgePoint } from '../../api/chapter'

interface TreeNodeData {
  id: number
  key: string
  title: string
  children?: TreeNodeData[]
}

export default function ExperimentEditor() {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([])
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [editingGuide, setEditingGuide] = useState('')
  const [editingDefaultCode, setEditingDefaultCode] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await chapterApi.list()
      const pts: TreeNodeData[] = []
      res.data.forEach((ch) => {
        pts.push({
          id: ch.id,
          key: ch.key,
          title: ch.title,
          children: ch.knowledge_points?.map((kp) => ({
            id: kp.id,
            key: kp.key,
            title: kp.title,
          })),
        })
      })
      setTreeData(pts)
    } catch (err: any) {
      message.error(err.response?.data?.detail || '加载课程失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const selectedNode = useMemo(() => {
    if (!selectedKey) return null
    for (const ch of treeData) {
      if (ch.key === selectedKey) return ch
      const found = ch.children?.find((c) => c.key === selectedKey)
      if (found) return found
    }
    return null
  }, [treeData, selectedKey])

  const isChapterKey = (key: string) => !key.includes('-')

  const handleSelect = useCallback(
    (keys: React.Key[]) => {
      const key = keys[0] as string
      if (!key || isChapterKey(key)) {
        setSelectedKey('')
        setEditingGuide('')
        setEditingDefaultCode('')
        return
      }
      setSelectedKey(key)
      const node = selectedNode
      if (node && !isChapterKey(node.key)) {
        // 获取知识点详情
        chapterApi.list().then((res) => {
          for (const ch of res.data) {
            const kp = ch.knowledge_points?.find((p) => p.key === key)
            if (kp) {
              setEditingGuide(kp.guide || '')
              setEditingDefaultCode(kp.default_code || '')
              break
            }
          }
        })
      }
    },
    [selectedNode]
  )

  const handleSave = async () => {
    if (!selectedKey) {
      message.warning('请先选中一个知识点')
      return
    }
    setSaving(true)
    try {
      const node = selectedNode
      if (!node) return
      await chapterApi.updatePoint(node.id, {
        guide: editingGuide,
        default_code: editingDefaultCode,
      })
      message.success('保存成功')
    } catch (err: any) {
      message.error(err.response?.data?.detail || '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const treeNodes: DataNode[] = useMemo(() => {
    const mapNode = (n: TreeNodeData): DataNode => ({
      key: n.key,
      title: n.title,
      icon: n.children ? undefined : <FileOutlined />,
      children: n.children?.map(mapNode),
    })
    return treeData.map(mapNode)
  }, [treeData])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'guide' | 'code' = 'guide') => {
    const file = e.target.files?.[0]
    if (!file) return
    if (target === 'guide' && !file.name.endsWith('.md')) {
      message.warning('请上传 .md 格式的 Markdown 文件')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (target === 'guide') {
        setEditingGuide(text)
      } else {
        setEditingDefaultCode(text)
      }
      message.success(`已导入：${file.name}`)
    }
    reader.onerror = () => message.error('文件读取失败')
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: 'guide' | 'code' = 'guide') => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    if (target === 'guide' && !file.name.endsWith('.md')) {
      message.warning('请上传 .md 格式的 Markdown 文件')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (target === 'guide') {
        setEditingGuide(text)
      } else {
        setEditingDefaultCode(text)
      }
      message.success(`已导入：${file.name}`)
    }
    reader.onerror = () => message.error('文件读取失败')
    reader.readAsText(file)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h2 style={{ margin: 0 }}>实验编辑</h2>
          <p style={{ color: '#888', margin: '4px 0 0' }}>管理每个知识点的操作指导与默认代码</p>
        </div>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
          保存修改
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
        {/* 左侧知识点列表 */}
        <Card
          title="知识点列表"
          style={{ width: 340, flexShrink: 0 }}
          bodyStyle={{ padding: '12px 0' }}
        >
          <Tree
            treeData={treeNodes}
            selectedKeys={[selectedKey]}
            onSelect={handleSelect}
            showIcon
            defaultExpandAll
            expandAction="click"
          />
        </Card>

        {/* 右侧编辑 */}
        <Card
          title={
            <span>
              <ExperimentOutlined style={{ marginRight: 8 }} />
              {selectedNode && !isChapterKey(selectedNode.key) ? '编辑实验配置' : '实验配置'}
            </span>
          }
          style={{ flex: 1 }}
        >
          {selectedNode && !isChapterKey(selectedNode.key) ? (
            <Form layout="vertical">
              <Form.Item label="知识点标题">
                <Input value={selectedNode.title} disabled />
              </Form.Item>

              <div style={{ marginBottom: 12 }}>
                <input
                  type="file"
                  accept=".md"
                  id="md-guide-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'guide')}
                />
                <label htmlFor="md-guide-upload" style={{ cursor: 'pointer' }}>
                  <Button icon={<UploadOutlined />} onClick={(e) => e.preventDefault()}>
                    上传操作指导文件
                  </Button>
                </label>
                <span style={{ marginLeft: 12, color: '#888', fontSize: 13 }}>
                  或拖拽 .md 文件到下方
                </span>
              </div>
              <Form.Item label="操作指导（Markdown）">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, 'guide')}
                >
                  <Input.TextArea
                    value={editingGuide}
                    onChange={(e) => setEditingGuide(e.target.value)}
                    rows={10}
                    placeholder="请输入代码实操的操作指导（Markdown 格式），或拖拽 .md 文件到此处"
                  />
                </div>
              </Form.Item>

              <Form.Item label="默认代码（Python）" style={{ marginBottom: 0 }}>
                <Input.TextArea
                  value={editingDefaultCode}
                  onChange={(e) => setEditingDefaultCode(e.target.value)}
                  rows={10}
                  placeholder="请输入 Python 默认代码，学生打开代码练习时编辑器会加载此代码"
                />
              </Form.Item>
            </Form>
          ) : (
            <div style={{ padding: 80, textAlign: 'center', color: '#888' }}>
              请在左侧目录中选择一个知识点进行编辑
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

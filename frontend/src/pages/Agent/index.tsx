import { Card, Input, Button, List, Avatar, Empty } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      time: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Mock AI 回复 — 实际应调大模型 API
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '【功能开发中】智能助手即将上线，届时可为你提供知识点答疑、代码辅导等服务。',
        time: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)' }}>
      <h2>智能助手</h2>
      <p style={{ color: '#888', marginBottom: 16 }}>AI 辅导答疑 · 代码讲解 · 思路引导</p>

      <Card style={{ flex: 1, overflow: 'auto', marginBottom: 16 }} bodyStyle={{ padding: 0 }}>
        {messages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="开始对话吧，AI 助手将为你解答问题"
            style={{ marginTop: 80 }}
          />
        ) : (
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item
                style={{
                  padding: '12px 24px',
                  background: msg.role === 'assistant' ? '#f6ffed' : 'transparent',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={msg.role === 'assistant' ? <RobotOutlined /> : <UserOutlined />}
                      style={{
                        background: msg.role === 'assistant' ? '#52c41a' : '#1890ff',
                      }}
                    />
                  }
                  title={
                    <span>
                      {msg.role === 'assistant' ? 'AI 助手' : '我'}
                      <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>{msg.time}</span>
                    </span>
                  }
                  description={
                    <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{msg.content}</div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <div style={{ display: 'flex', gap: 12 }}>
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入问题，如：二叉树后序遍历怎么用栈实现？"
          autoSize={{ minRows: 2, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={loading}
          onClick={handleSend}
          style={{ height: 'auto' }}
        >
          发送
        </Button>
      </div>
    </div>
  )
}

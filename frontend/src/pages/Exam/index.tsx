import { useState } from 'react'
import { Card, Form, Input, DatePicker, Button, Table, Space, Modal, Popconfirm, Tag, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface Exam {
  id: number
  title: string
  startTime: string
  duration: number
  description: string
  status: string
}

const initialExams: Exam[] = [
  { id: 1, title: '期中考试', startTime: '2025-07-20 09:00', duration: 120, description: '考察第1-4章内容', status: '未开始' },
  { id: 2, title: '期末考试', startTime: '2025-08-25 14:00', duration: 150, description: '全学期内容', status: '未开始' },
]

let nextId = 100

export default function Exam() {
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Exam | null>(null)
  const [form] = Form.useForm()
  const [addForm] = Form.useForm()

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields()
      const newExam: Exam = {
        id: nextId++,
        title: values.title,
        startTime: values.startTime?.format('YYYY-MM-DD HH:mm') || '',
        duration: Number(values.duration) || 120,
        description: values.description || '',
        status: '未开始',
      }
      setExams((prev) => [newExam, ...prev])
      addForm.resetFields()
      message.success('考试发布成功')
    } catch {
      // validation failed
    }
  }

  const handleEdit = (record: Exam) => {
    setEditingRecord(record)
    form.setFieldsValue({
      title: record.title,
      startTime: record.startTime,
      duration: record.duration,
      description: record.description,
    })
    setIsModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields()
      if (!editingRecord) return
      setExams((prev) =>
        prev.map((e) =>
          e.id === editingRecord.id
            ? {
                ...e,
                title: values.title,
                startTime: values.startTime || e.startTime,
                duration: Number(values.duration) || e.duration,
                description: values.description || '',
              }
            : e
        )
      )
      setIsModalOpen(false)
      message.success('修改成功')
    } catch {
      // validation failed
    }
  }

  const handleDelete = (id: number) => {
    setExams((prev) => prev.filter((e) => e.id !== id))
    message.success('已删除')
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 160 },
    { title: '时长(分钟)', dataIndex: 'duration', key: 'duration', width: 110 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '未开始' ? 'orange' : status === '进行中' ? 'green' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: Exam) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2>考试管理</h2>

      <Card title="发布新考试" style={{ marginBottom: 24 }}>
        <Form form={addForm} layout="inline">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="考试标题" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            label="开始时间"
            name="startTime"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker showTime placeholder="选择日期时间" />
          </Form.Item>
          <Form.Item
            label="时长(分钟)"
            name="duration"
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <Input type="number" placeholder="120" style={{ width: 100 }} />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input placeholder="考试描述（可选）" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              发布
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="考试列表">
        <Table dataSource={exams} columns={columns} rowKey="id" />
      </Card>

      <Modal
        title="编辑考试"
        open={isModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="开始时间" name="startTime">
            <Input placeholder="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item label="时长(分钟)" name="duration">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

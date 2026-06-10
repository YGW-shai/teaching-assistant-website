import { useState } from 'react'
import { Card, Form, Input, DatePicker, Button, Table, Space, Modal, Popconfirm, Tag, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface Homework {
  id: number
  title: string
  deadline: string
  description: string
  status: string
  submitCount: number
  totalCount: number
}

const initialHomeworks: Homework[] = [
  { id: 1, title: '顺序表实现', deadline: '2025-07-15', description: '用 Python 实现顺序表，支持插入、删除、查找操作。', status: '已发布', submitCount: 45, totalCount: 86 },
  { id: 2, title: '单链表反转', deadline: '2025-07-22', description: '实现单链表的反转算法，要求空间复杂度 O(1)。', status: '已发布', submitCount: 32, totalCount: 86 },
]

let nextId = 100

export default function Homework() {
  const [homeworks, setHomeworks] = useState<Homework[]>(initialHomeworks)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Homework | null>(null)
  const [form] = Form.useForm()
  const [addForm] = Form.useForm()

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields()
      const newHw: Homework = {
        id: nextId++,
        title: values.title,
        deadline: values.deadline?.format('YYYY-MM-DD') || '',
        description: values.description || '',
        status: '已发布',
        submitCount: 0,
        totalCount: 86,
      }
      setHomeworks((prev) => [newHw, ...prev])
      addForm.resetFields()
      message.success('作业发布成功')
    } catch {
      // validation failed
    }
  }

  const handleEdit = (record: Homework) => {
    setEditingRecord(record)
    form.setFieldsValue({
      title: record.title,
      deadline: record.deadline,
      description: record.description,
    })
    setIsModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields()
      if (!editingRecord) return
      setHomeworks((prev) =>
        prev.map((h) =>
          h.id === editingRecord.id
            ? {
                ...h,
                title: values.title,
                deadline: values.deadline || h.deadline,
                description: values.description || '',
              }
            : h
        )
      )
      setIsModalOpen(false)
      message.success('修改成功')
    } catch {
      // validation failed
    }
  }

  const handleDelete = (id: number) => {
    setHomeworks((prev) => prev.filter((h) => h.id !== id))
    message.success('已删除')
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '截止时间', dataIndex: 'deadline', key: 'deadline', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '已发布' ? 'blue' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: '提交情况',
      key: 'submit',
      width: 120,
      render: (_: any, r: Homework) => `${r.submitCount}/${r.totalCount}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: Homework) => (
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
      <h2>作业管理</h2>

      <Card title="发布新作业" style={{ marginBottom: 24 }}>
        <Form form={addForm} layout="inline">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="作业标题" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item
            label="截止时间"
            name="deadline"
            rules={[{ required: true, message: '请选择截止时间' }]}
          >
            <DatePicker placeholder="选择日期" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input placeholder="作业描述（可选）" style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              发布
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="作业列表">
        <Table dataSource={homeworks} columns={columns} rowKey="id" />
      </Card>

      <Modal
        title="编辑作业"
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
          <Form.Item label="截止时间" name="deadline">
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

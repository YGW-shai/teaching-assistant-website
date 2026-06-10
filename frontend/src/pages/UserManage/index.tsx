import { useState } from 'react'
import { Card, Table, Button, Tag, Space, Switch, Modal, Form, Input, Select, Popconfirm, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface UserRecord {
  id: number
  username: string
  email: string
  full_name: string
  role: string
  is_active: boolean
}

const initialUsers: UserRecord[] = [
  { id: 1, username: 'student001', email: 's1@example.com', full_name: '张三', role: 'student', is_active: true },
  { id: 2, username: 'student002', email: 's2@example.com', full_name: '李四', role: 'student', is_active: true },
  { id: 3, username: 'teacher001', email: 't1@example.com', full_name: '张老师', role: 'teacher', is_active: true },
  { id: 4, username: 'student003', email: 's3@example.com', full_name: '王五', role: 'student', is_active: false },
]

const roleOptions = [
  { value: 'student', label: '学生' },
  { value: 'teacher', label: '教师' },
  { value: 'admin', label: '管理员' },
]

let nextId = 100

export default function UserManage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<UserRecord | null>(null)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
    )
    message.success('状态已更新')
  }

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields()
      if (users.some((u) => u.username === values.username)) {
        message.error('用户名已存在')
        return
      }
      const newUser: UserRecord = {
        id: nextId++,
        username: values.username,
        email: values.email,
        full_name: values.full_name || values.username,
        role: values.role,
        is_active: true,
      }
      setUsers((prev) => [...prev, newUser])
      addForm.resetFields()
      setIsAddModalOpen(false)
      message.success('账号创建成功')
    } catch {
      // validation failed
    }
  }

  const handleEdit = (record: UserRecord) => {
    setEditingRecord(record)
    editForm.setFieldsValue({
      username: record.username,
      email: record.email,
      full_name: record.full_name,
      role: record.role,
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    try {
      const values = await editForm.validateFields()
      if (!editingRecord) return
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingRecord.id
            ? { ...u, username: values.username, email: values.email, full_name: values.full_name, role: values.role }
            : u
        )
      )
      setIsEditModalOpen(false)
      message.success('修改成功')
    } catch {
      // validation failed
    }
  }

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    message.success('已删除')
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '姓名', dataIndex: 'full_name', key: 'full_name' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : role === 'teacher' ? 'blue' : 'green'}>
          {role === 'admin' ? '管理员' : role === 'teacher' ? '教师' : '学生'}
        </Tag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_: any, record: UserRecord) => (
        <Switch
          checked={record.is_active}
          onChange={() => toggleStatus(record.id)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: UserRecord) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description={`删除用户：${record.username}`}
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2>账号管理</h2>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
            新增账号
          </Button>
        </div>
        <Table dataSource={users} columns={columns} rowKey="id" />
      </Card>

      {/* 新增账号 Modal */}
      <Modal
        title="新增账号"
        open={isAddModalOpen}
        onOk={handleAdd}
        onCancel={() => {
          setIsAddModalOpen(false)
          addForm.resetFields()
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="姓名" name="full_name">
            <Input placeholder="请输入姓名（可选）" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入初始密码" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            initialValue="student"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select options={roleOptions} placeholder="选择角色" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑账号 Modal */}
      <Modal
        title="编辑账号"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true }, { type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="姓名" name="full_name">
            <Input />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

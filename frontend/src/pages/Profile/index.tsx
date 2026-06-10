import { Card, Form, Input, Button, message } from 'antd'
import { useUserStore } from '../../stores/userStore'

export default function Profile() {
  const { user, setUser } = useUserStore()
  const [form] = Form.useForm()

  const handleUpdateProfile = (values: { full_name: string }) => {
    // Mock：实际应调API
    setUser(user ? { ...user, full_name: values.full_name } : null)
    message.success('昵称已更新')
  }

  const handleChangePassword = (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次新密码输入不一致')
      return
    }
    // Mock：实际应调API
    message.success('密码修改成功，请重新登录')
  }

  return (
    <div>
      <h2>个人中心</h2>

      <Card title="基本信息" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            username: user?.username,
            email: user?.email,
            full_name: user?.full_name || '',
            role: user?.role_name === 'admin' ? '管理员' : user?.role_name === 'teacher' ? '教师' : '学生',
          }}
          onFinish={handleUpdateProfile}
        >
          <Form.Item label="用户名" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input disabled />
          </Form.Item>
          <Form.Item label="角色" name="role">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="昵称"
            name="full_name"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="修改密码">
        <Form layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="原密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="新密码" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[{ required: true, message: '请确认新密码' }]}
          >
            <Input.Password placeholder="确认新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

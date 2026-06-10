import { useState } from 'react'
import { Form, Input, Button, Card, message, Tabs } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../stores/authStore'
import { useUserStore } from '../../stores/userStore'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { setUser } = useUserStore()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (values: { student_id: string; password: string }) => {
    setLoading(true)
    try {
      const res = await authApi.login(values)
      login(res.data.access_token, res.data.user)
      setUser(res.data.user)
      message.success('登录成功')
      const role = res.data.user.role_name
      if (role === 'admin') navigate('/admin/home')
      else if (role === 'teacher') navigate('/teacher/home')
      else navigate('/home')
    } catch (err: any) {
      message.error(err.response?.data?.detail || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 400, borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#333' }}>教学辅助平台</h2>
          <p style={{ color: '#888', marginTop: 8 }}>高校编程教学辅助系统</p>
        </div>

        <Tabs centered defaultActiveKey="login" items={[
          {
            key: 'login',
            label: '登录',
            children: (
              <Form onFinish={handleLogin} layout="vertical">
                <Form.Item
                  label="学号"
                  name="student_id"
                  rules={[{ required: true, message: '请输入学号' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入学号" />
                </Form.Item>
                <Form.Item
                  label="密码"
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    登录
                  </Button>
                </Form.Item>
              </Form>
            )
          },
          {
            key: 'register',
            label: '注册',
            children: <RegisterForm />
          }
        ]} />
      </Card>
    </div>
  )
}

function RegisterForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleRegister = async (values: { student_id: string; name: string; password: string; confirm: string }) => {
    if (values.password !== values.confirm) {
      message.error('两次密码不一致')
      return
    }
    setLoading(true)
    try {
      await authApi.register({
        student_id: values.student_id,
        full_name: values.name,
        password: values.password,
      })
      message.success('注册成功，请登录')
      navigate('/login')
      window.location.reload()
    } catch (err: any) {
      message.error(err.response?.data?.detail || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onFinish={handleRegister} layout="vertical">
      <Form.Item
        label="学号"
        name="student_id"
        rules={[{ required: true, message: '请输入学号' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="请输入学号" />
      </Form.Item>
      <Form.Item
        label="姓名"
        name="name"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input placeholder="请输入真实姓名" />
      </Form.Item>
      <Form.Item
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="请设置密码" />
      </Form.Item>
      <Form.Item
        label="确认密码"
        name="confirm"
        rules={[{ required: true, message: '请确认密码' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="再次输入密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          注册
        </Button>
      </Form.Item>
    </Form>
  )
}

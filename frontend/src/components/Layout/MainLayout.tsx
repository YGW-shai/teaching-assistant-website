import { Layout, Menu, Avatar, Dropdown, theme } from 'antd'
import {
  BookOutlined,
  CodeOutlined,
  RobotOutlined,
  HomeOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserOutlined,
  EditOutlined,
  FileTextOutlined,
  ProfileOutlined,
  DashboardOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useUserStore } from '../../stores/userStore'

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthStore()
  const { user } = useUserStore()
  const { token: themeToken } = theme.useToken()

  const role = user?.role_name || 'student'

  // 按角色定义菜单
  const menuConfig: Record<string, any[]> = {
    student: [
      { key: '/home', icon: <HomeOutlined />, label: '首页' },
      { key: '/course', icon: <BookOutlined />, label: '课程内容' },
      { key: '/practice', icon: <CodeOutlined />, label: '代码实操' },
      { key: '/agent', icon: <RobotOutlined />, label: '智能助手' },
    ],
    teacher: [
      { key: '/teacher/home', icon: <HomeOutlined />, label: '教师首页' },
      { key: '/course-editor', icon: <EditOutlined />, label: '课程编辑' },
      { key: '/experiment-editor', icon: <ExperimentOutlined />, label: '实验编辑' },
      { key: '/homework', icon: <FileTextOutlined />, label: '作业发布' },
      { key: '/exam', icon: <FileTextOutlined />, label: '考试发布' },
      { key: '/agent', icon: <RobotOutlined />, label: '智能助手' },
    ],
    admin: [
      { key: '/admin/home', icon: <DashboardOutlined />, label: '数据概览' },
      { key: '/user-manage', icon: <TeamOutlined />, label: '账号管理' },
      { key: '/agent', icon: <RobotOutlined />, label: '智能助手' },
    ],
  }

  const menuItems = menuConfig[role] || menuConfig.student

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleLogout = () => {
    logout()
    useUserStore.getState().setUser(null)
    navigate('/login')
  }

  const dropdownItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'divider1',
      type: 'divider' as const,
    },
    {
      key: 'user-info',
      icon: <UserOutlined />,
      label: `${user?.username || '用户'} (${role === 'admin' ? '管理员' : role === 'teacher' ? '教师' : '学生'})`,
      disabled: true,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: themeToken.colorPrimary,
        }}
      >
        <div style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          <TeamOutlined style={{ marginRight: 8 }} />
          教学辅助平台
        </div>
        <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
          <Avatar style={{ cursor: 'pointer', backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Content style={{ padding: 24, background: '#f5f5f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

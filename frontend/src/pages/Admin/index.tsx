import { Card, Tag } from 'antd'
import { useUserStore } from '../../stores/userStore'

export default function Admin() {
  const { user } = useUserStore()

  return (
    <div>
      <h2>管理员后台</h2>
      <Card title="当前用户信息">
        <p>
          <strong>用户名：</strong>
          {user?.username}
        </p>
        <p>
          <strong>邮箱：</strong>
          {user?.email}
        </p>
        <p>
          <strong>角色：</strong>
          <Tag color="red">{user?.role_name}</Tag>
        </p>
        <p>
          <strong>权限：</strong>
          用户管理、角色管理、课程管理、系统配置
        </p>
      </Card>
      <p style={{ marginTop: 16, color: '#888' }}>
        管理员功能（用户管理、角色分配、系统配置）将在后续迭代中完善。
      </p>
    </div>
  )
}

import { Card, Statistic, Row, Col } from 'antd'
import {
  BookOutlined,
  CodeOutlined,
  RobotOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { useUserStore } from '../../stores/userStore'

export default function Dashboard() {
  const { user } = useUserStore()
  const roleText =
    user?.role_name === 'admin'
      ? '管理员'
      : user?.role_name === 'teacher'
        ? '教师'
        : '学生'

  return (
    <div>
      <h2>
        欢迎，{user?.full_name || user?.username || '用户'}！（{roleText}）
      </h2>
      <p style={{ color: '#888' }}>
        这是教学辅助平台的仪表盘，后续将展示学习数据、进度统计等信息。
      </p>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="已学知识点"
              value={0}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="编程练习"
              value={0}
              prefix={<CodeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="AI 对话"
              value={0}
              prefix={<RobotOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="学习积分"
              value={0}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="平台概览" style={{ marginTop: 24 }}>
        <p>教学辅助平台 v1.0 — 面向高校编程课程的一体化学习平台</p>
        <p>三大核心模块：课程内容 · 编程实践 · 智能辅导</p>
      </Card>
    </div>
  )
}

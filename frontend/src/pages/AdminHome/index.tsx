import { Card, Row, Col, Statistic } from 'antd'
import {
  TeamOutlined,
  BookOutlined,
  CodeOutlined,
  RiseOutlined,
} from '@ant-design/icons'

export default function AdminHome() {
  return (
    <div>
      <h2>平台数据概览</h2>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="注册用户" value={1248} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="课程总数" value={36} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日活跃" value={156} prefix={<RiseOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="代码提交" value={3421} prefix={<CodeOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="用户角色分布">
            <p>学生：1086 人</p>
            <p>教师：42 人</p>
            <p>管理员：3 人</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="近7日趋势">
            <p>日活用户：120 → 135 → 128 → 156 → 142 → 138 → 156（持续上升）</p>
            <p>新增注册：12 → 15 → 8 → 20 → 18 → 14 → 22</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

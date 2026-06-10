import { Card, Row, Col, Badge, Progress } from 'antd'
import {
  BookOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

// Mock 课程数据
const mockCourses = [
  {
    id: 'cs101',
    title: '数据结构与算法',
    teacher: '张老师',
    progress: 65,
    totalChapters: 8,
    completedChapters: 5,
    cover: '#1890ff',
    tag: '核心课',
  },
  {
    id: 'cs102',
    title: 'Python 程序设计',
    teacher: '李老师',
    progress: 30,
    totalChapters: 10,
    completedChapters: 3,
    cover: '#52c41a',
    tag: '基础课',
  },
  {
    id: 'cs103',
    title: '机器学习基础',
    teacher: '王老师',
    progress: 0,
    totalChapters: 6,
    completedChapters: 0,
    cover: '#722ed1',
    tag: '选修课',
  },
]

export default function StudentHome() {
  const navigate = useNavigate()

  return (
    <div>
      <h2>本学期课程</h2>
      <p style={{ color: '#888', marginBottom: 24 }}>
        共 {mockCourses.length} 门课程，继续加油！
      </p>

      <Row gutter={[24, 24]}>
        {mockCourses.map((course) => (
          <Col xs={24} sm={12} lg={8} key={course.id}>
            <Card
              hoverable
              onClick={() => navigate(`/course/${course.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div
                style={{
                  height: 120,
                  background: course.cover,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <BookOutlined style={{ fontSize: 48, color: '#fff' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>{course.title}</h3>
                <Badge count={course.tag} style={{ backgroundColor: course.cover }} />
              </div>

              <p style={{ color: '#888', marginBottom: 16 }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {course.teacher} · 已学 {course.completedChapters}/{course.totalChapters} 章
              </p>

              <Progress percent={course.progress} size="small" status={course.progress === 100 ? 'success' : 'active'} />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="学习提醒" style={{ marginTop: 24 }}>
        <p>Python 程序设计 第4章「函数与递归」即将截止，请尽快完成。</p>
      </Card>
    </div>
  )
}

import { Card, Row, Col, Statistic, Button } from 'antd'
import {
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const mockMyCourses = [
  {
    id: 'cs101',
    title: '数据结构与算法',
    students: 86,
    chapters: 8,
    homeworks: 12,
    status: '进行中',
  },
  {
    id: 'cs102',
    title: 'Python 程序设计',
    students: 120,
    chapters: 10,
    homeworks: 15,
    status: '进行中',
  },
]

export default function TeacherHome() {
  const navigate = useNavigate()

  return (
    <div>
      <h2>我的课程</h2>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="授课课程" value={2} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="学生总数" value={206} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="待批改作业" value={34} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Button type="primary" icon={<PlusOutlined />} block>
              新建课程
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {mockMyCourses.map((course) => (
          <Col xs={24} sm={12} key={course.id}>
            <Card
              title={course.title}
              extra={<Button type="link" onClick={() => navigate(`/course-editor/${course.id}`)}>编辑</Button>}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic title="学生" value={course.students} />
                </Col>
                <Col span={8}>
                  <Statistic title="章节" value={course.chapters} />
                </Col>
                <Col span={8}>
                  <Statistic title="作业" value={course.homeworks} />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

import { Card, Row, Col, Typography } from 'antd';
import { BookOutlined, SoundOutlined, CheckCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { paths } from '../../lib/path';

const { Title, Paragraph } = Typography;

const colorfulCardStyle = {
  borderRadius: "20px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  color: "white",
  height: "100%",
  transition: "transform 0.2s ease-in-out",
};

const hoverEffect = {
  transform: "scale(1.02)",
};

const StudentDashboard = () => {

  const user = JSON.parse(localStorage.getItem("user")) || {};
  return (
    <div className="p-6">
      <Title level={2} className="text-blue-800">🎓 Welcome, {user?.name || "Student"}!</Title>
      <Paragraph className="text-gray-600">Select a module to begin learning:</Paragraph>

      {/* Courses Section */}
      <div className="mt-6">
        <Title level={4} className="text-purple-700 text-lg font-bold">📚 Courses</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Link to={paths.COURSES}>
              <Card
                hoverable
                style={{
                  ...colorfulCardStyle,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <BookOutlined style={{ fontSize: 40 }} />
                <Title level={4} className="mt-3 text-white">Start a New Course</Title>
                <Paragraph className="text-white">Begin a new course and track your learning journey.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Link to={paths.STUDENT_PROGRESS} state={{ type: 'courses' }}>
              <Card
                hoverable
                style={{
                  ...colorfulCardStyle,
                  background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <CheckCircleOutlined style={{ fontSize: 40 }} />
                <Title level={4} className="mt-3 text-white text-lg">Completed Courses</Title>
                <Paragraph className="text-white">Check what you've completed and how far you’ve come.</Paragraph>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>

      {/* Speech Practice Section */}
      <div className="mt-10">
        <Title level={4} className="text-orange-600">🗣️ Speech Practice</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Link to={paths.LIST_SPEECH_PRACTISE}>
              <Card
                hoverable
                style={{
                  ...colorfulCardStyle,
                  background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <SoundOutlined style={{ fontSize: 40 }} />
                <Title level={4} className="mt-3 text-white">Start Speech Practice</Title>
                <Paragraph className="text-white">Improve your pronunciation with guided speech tasks.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Link to={paths.STUDENT_PROGRESS} state={{ type: 'speech' }}>
              <Card
                hoverable
                style={{
                  ...colorfulCardStyle,
                  background: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <CheckCircleOutlined style={{ fontSize: 40 }} />
                <Title level={4} className="mt-3 text-white">Completed Practices</Title>
                <Paragraph className="text-white">Review your previous attempts and track your growth.</Paragraph>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>

      <div className="mt-10">
        <Title level={4} className="text-orange-600"> Listening Practice</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Link to={paths.LISTENING_COURSE_LIST}>
              <Card
                hoverable
                style={{
                  ...colorfulCardStyle,
                  background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <SoundOutlined style={{ fontSize: 40 }} />
                <Title level={4} className="mt-3 text-white">Start Listening Practice</Title>
                <Paragraph className="text-white">Improve your pronunciation with guided listening tasks.</Paragraph>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Link to={paths.STUDENT_PROGRESS} state={{ type: 'listening' }}>
              <Card
                hoverable
                style={{
                  ...colorfulCardStyle,
                  background: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <CheckCircleOutlined style={{ fontSize: 40 }} />
                <Title level={4} className="mt-3 text-white">Completed s</Title>
                <Paragraph className="text-white">Review your previous attempts and track your growth.</Paragraph>
              </Card>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StudentDashboard;

import { Card, Row, Col, Typography } from 'antd';
import {
  BookOutlined,
  CheckCircleOutlined,
  SoundOutlined,
  AudioOutlined
} from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { paths } from '../../lib/path';

const { Title, Paragraph } = Typography;

const colorfulCardStyle = {
  borderRadius: '20px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  color: 'white',
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
};

const cardBoxStyle = {
  width: '200px',
  height: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
};

const StudentDashboard = () => {
  const user = localStorage.getItem('user')
  const modules = [
    {
      title: "Start a New Course",
      desc: "Begin a new course and track your progress.",
      icon: <BookOutlined className="text-blue-600 text-3xl" />,
      link: paths.COURSES,
    },

    {
      title: "Start Speech Practice",
      desc: "Improve your pronunciation with guided tasks.",
      icon: <SoundOutlined className="text-orange-500 text-3xl" />,
      link: paths.LIST_SPEECH_PRACTISE,
    },

    {
      title: "Start Listening Practice",
      desc: "Sharpen comprehension with listening tasks.",
      icon: <AudioOutlined className="text-indigo-500 text-3xl" />,
      link: paths.LISTENING_COURSE_LIST
    },

    {
      title: "Completed Sessions",
      desc: "Review past sessions and measure growth.",
      icon: <CheckCircleOutlined className="text-green-600 text-3xl" />,
      link: paths.STUDENT_PROGRESS,
    },
  ];

  return (
    <div className="p-6 w-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <Title level={2} className="text-gray-800">
          Welcome, {user?.name || "Student"}
        </Title>
        <Paragraph className="text-gray-600 text-base">
          Select a module to begin your learning journey.
        </Paragraph>
      </div>

      {/* Unified Grid Section */}
      <Row gutter={[16, 16]}>
        {modules.map((m, i) => (
          <Col xs={24} sm={12} md={8} lg={6} key={i}>
            <Link to={m.link}>
              <Card hoverable className="shadow-sm rounded-xl h-full">
                {m.icon}
                <Title level={5} className="mt-4 mb-1 text-gray-800">
                  {m.title}
                </Title>
                <Paragraph className="text-gray-600 text-sm">{m.desc}</Paragraph>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StudentDashboard;

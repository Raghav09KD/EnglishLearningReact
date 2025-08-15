import { Card, Row, Col, Typography } from 'antd';
import {
  BookOutlined,
  SoundOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
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
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="p-6">
      <Title level={2} className="text-blue-800">
        🎓 Welcome, {user?.name || 'Student'}!
      </Title>
      <Paragraph className="text-gray-600">
        Select a module to begin learning:
      </Paragraph>

      {/* Courses Section (2 per row) */}
      <Title level={4} className="text-orange-600">📚 Courses</Title>
      <div style={{ display: "flex", gap: "60px" }}>

        <Link to={paths.COURSES}>
          <Card
            hoverable
            style={{
              ...colorfulCardStyle,
              background: "linear-gradient(135deg, #f1a63cff 0%, #f5e19dff 100%)",
              width: 300,
              height: 210,
              margin: 0,
            }}
            bodyStyle={{ padding: 20 }}
          >
            <BookOutlined style={{ fontSize: 26, color: "#fff" }} />
            <Title level={4} className="text-white">Start a New Course</Title>
            <Paragraph className="text-white">Begin a new course and track your learning journey</Paragraph>
          </Card>
        </Link>

        <Link to={paths.STUDENT_PROGRESS} state={{ type: 'courses' }}>
          <Card
            hoverable
            style={{
              ...colorfulCardStyle,
              background: "linear-gradient(135deg, #6096f3ff 0%, #82deeeff 100%)",
              width: 300,
              height: 210,
              margin: 0,
            }}
            bodyStyle={{ padding: 16 }}
          >
            <CheckCircleOutlined style={{ fontSize: 26, color: "#fff" }} />
            <Title level={4} className="text-white">Completed Courses</Title>
            <Paragraph className="text-white">Check what you've completed and how far you’ve come.</Paragraph>
          </Card>
        </Link>

      </div>

      {/* Speech Practice */}
      <div className="mt-10">
        <Title level={4} className="text-orange-600">🗣️ Speech Practice</Title>
        <div style={{ display: "flex", gap: "60px" }}>
          <Link to={paths.LIST_SPEECH_PRACTISE}>
            <Card
              hoverable
              style={{
                ...colorfulCardStyle,
                background: "linear-gradient(135deg, #6096f3ff 0%, #82deeeff 100%)", 
                width: 300,
                height: 210,
                margin: 0,
              }}
              bodyStyle={{ padding: 16 }}
            >
              <SoundOutlined style={{ fontSize: 26, color: "#fff" }} />
              <Title level={4} className="text-white">Start Speech Practice</Title>
              <Paragraph className="text-white">Improve your pronunciation with guided speech tasks.</Paragraph>
            </Card>
          </Link>

          <Link to={paths.STUDENT_PROGRESS} state={{ type: 'speech' }}>
            <Card
              hoverable
              style={{
                ...colorfulCardStyle,
                background: "linear-gradient(135deg, #f098a6ff 0%, #a870e0ff 100%)", 
                width: 300,
                height: 210,
                margin: 0,
              }}
              bodyStyle={{ padding: 16 }}
            >
              <CheckCircleOutlined style={{ fontSize: 26, color: "#fff" }} />
              <Title level={4} className="text-white">Completed Practices</Title>
              <Paragraph className="text-white">Review your previous attempts and track your growth.</Paragraph>
            </Card>
          </Link>
        </div>
      </div>

      {/* Listening Practice */}
      <div className="mt-10">
        <Title level={4} className="text-orange-600">🎧 Listening Practice</Title>
        <div style={{ display: "flex", gap: "60px" }}>
          <Link to={paths.LISTENING_COURSE_LIST}>
            <Card
              hoverable
              style={{
                ...colorfulCardStyle,
                background: "linear-gradient(135deg, #f098a6ff 0%, #a870e0ff 100%)", // yellow
                width: 300,
                height: 210,
                margin: 0,
              }}
              bodyStyle={{ padding: 16 }}
            >
              <CheckCircleOutlined style={{ fontSize: 26, color: "#fff" }} />
              <Title level={4} className="text-white">Start Listening Practice</Title>
              <Paragraph className="text-white">Improve your pronunciation with guided listening tasks.</Paragraph>
            </Card>
          </Link>

          <Link to={paths.STUDENT_PROGRESS} state={{ type: 'listening' }}>
            <Card
              hoverable
              style={{
                ...colorfulCardStyle,
                background: "linear-gradient(135deg, #f1a63cff 0%, #f5e19dff 100%)", // red
                width: 300,
                height: 210,
                margin: 0,
              }}
              bodyStyle={{ padding: 16 }}
            >
              <CheckCircleOutlined style={{ fontSize: 26, color: "#fff" }} />
              <Title level={4} className="text-white">Completed Listening</Title>
              <Paragraph className="text-white">Review your previous attempts and track your growth.</Paragraph>
            </Card>
          </Link>
        </div>
      </div>



      {/* Level Selection Section */}
      <div className="mt-10">
        <Title level={4} className="text-green-600">
          📊 Choose Your Level
        </Title>

        <div
          style={{
            display: 'flex',
            gap: '50px',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/courses?level=easy">
            <img
              src="https://ichef.bbci.co.uk/images/ic/624xn/p0klbn3v.jpg"
              alt="Easy"
              style={{
                width: '220px',
                height: '200px',
                borderRadius: '15px',
                cursor: 'pointer',
                objectFit: 'cover',
              }}
            />
          </Link>

          <Link to="/courses?level=medium">
            <img
              src="https://ichef.bbci.co.uk/images/ic/1248xn/p0klbn4w.jpg"
              alt="Medium"
              style={{
                width: '220px',
                height: '200px',
                borderRadius: '15px',
                cursor: 'pointer',
                objectFit: 'cover',
              }}
            />
          </Link>

          <Link to={paths.COURSES} state={{ level: 'hard' }}>
            <img
              src="https://ichef.bbci.co.uk/images/ic/1248xn/p0klbn5v.jpg"
              alt="Hard"
              style={{
                width: '220px',
                height: '200px',
                borderRadius: '15px',
                cursor: 'pointer',
                objectFit: 'cover',
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

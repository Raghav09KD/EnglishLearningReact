import { Card, Row, Col, Typography } from 'antd';
import { BookOutlined, CheckCircleOutlined, SoundOutlined, AudioOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { paths } from '../../lib/path';
import dashboardImage from "../../assets/svgs/bg-image.png";

const { Title, Paragraph } = Typography;

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
      link: paths.LISTENING_COURSE_LIST,
    },
    {
      title: "Completed Sessions",
      desc: "Review past sessions and measure growth.",
      icon: <CheckCircleOutlined className="text-green-600 text-3xl" />,
      link: paths.STUDENT_PROGRESS,
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden shadow-md mb-12 bg-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at top left, rgba(59,130,246,0.2), transparent 25%),
              radial-gradient(circle at top right, rgba(59,130,246,0.2), transparent 25%)
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to top, rgba(0,0,0,0.05), transparent 40%),
              linear-gradient(to bottom, rgba(0,0,0,0.05), transparent 40%)
            `,
          }}
        />
        <div className="relative pt-20 pb-32 px-8 md:px-24">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <Title level={2} className="text-gray-800">
                Welcome, {user?.name || "Student"}
              </Title>
              <Paragraph className="text-gray-600 text-base mb-2">
                Select a module to begin your learning journey.
              </Paragraph>
              <Paragraph className="text-gray-500 text-sm mb-6">
                Your personalized platform to improve English speaking,
                listening, and comprehension skills. Stay consistent and
                track your growth every day.
              </Paragraph>

              <div className="flex gap-4">
                <a href="#modules">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                    Explore Modules
                  </button>
                </a>

                <Link to={paths.STUDENT_PROGRESS}>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-md transition">
                    View Progress
                  </button>
                </Link>
              </div>
            </Col>

            {/* Right Side - Image (Hidden on xs and sm screens) */}
            <Col xs={24} md={12} className="text-center hidden md:block">
              <img
                src={dashboardImage}
                alt="Dashboard Illustration"
                className="max-w-full h-auto"
                style={{
                  maxHeight: '350px',
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div id="modules" className="text-center mb-8">
        <Title level={3} className="text-gray-800">
          Browse Modules
        </Title>
      </div>

      {/* Modules Grid Section */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
          {modules.map((m, i) => (
            <Link to={m.link} key={i}>
              <Card hoverable className="shadow-sm rounded-xl h-full text-center">
                {m.icon}
                <Title level={5} className="mt-4 mb-1 text-gray-800">
                  {m.title}
                </Title>
                <Paragraph className="text-gray-600 text-sm">
                  {m.desc}
                </Paragraph>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 bg-gray-50 border-t border-gray-200 py-6 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Engli Learn. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 mt-2 text-sm text-gray-500">
          <a className="hover:text-blue-600">About</a>
          <a className="hover:text-blue-600">Contact</a>
          <a className="hover:text-blue-600">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;

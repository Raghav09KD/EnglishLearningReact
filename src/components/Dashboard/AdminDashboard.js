import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { Card, Col, Row, Button, Typography } from "antd";
import { PlusCircleOutlined, BookOutlined, UserOutlined, SoundOutlined } from "@ant-design/icons";
import {
  BookOpen,
  FileText,
  Volume2,
  PlusCircle,
} from "lucide-react";

import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { paths } from '../../lib/path';
import request from '../../lib/api/request';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const { Title } = Typography;
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    grammarCount: 0,
    vocabCount: 0,
    storyCount: 0,
    pronunciationCount: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [grammarRes, vocabRes, storyRes, pronunciationRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/grammar'),
        axios.get('http://localhost:5000/api/vocabulary'),
        axios.get('http://localhost:5000/api/stories'),
        axios.get('http://localhost:5000/api/pronunciation'),
      ]);

      setStats({
        grammarCount: grammarRes.data.length,
        vocabCount: vocabRes.data.length,
        storyCount: storyRes.data.length,
        pronunciationCount: pronunciationRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const chartData = {
    labels: ['Grammar', 'Vocabulary', 'Stories', 'Pronunciation'],
    datasets: [
      {
        label: 'Content Count',
        data: [
          stats.grammarCount,
          stats.vocabCount,
          stats.storyCount,
          stats.pronunciationCount,
        ],
        backgroundColor: ['#4a90e2', '#7ed6df', '#f6b93b', '#9b59b6'], // Muted pastels
        borderRadius: 12,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#2f3640',
        bodyColor: '#2f3640',
        borderColor: '#dcdde1',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#636e72',
          font: { size: 14 },
        },
        grid: {
          color: '#ecf0f1',
          borderDash: [4, 4],
        },
      },
      x: {
        ticks: {
          color: '#636e72',
          font: { size: 14 },
        },
        grid: {
          display: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };



  return (
    <div className="p-4">
      <Title level={2}>Admin Dashboard</Title>

      {/* Content Section */}
      <Title level={4} className="mt-6">📚 Course Management</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to={paths.ADD_COURSE}>
            <Card
              hoverable
              title="Add Course"
              bordered
              actions={[<PlusCircleOutlined key="add" />]}
            >
              {/* <p>Total Courses: {stats.courseCount ?? 0}</p> */}
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to={paths.MANAGE_COURSE}>
            <Card
              hoverable
              title="Manage Courses"
              bordered
              actions={[<BookOutlined key="manage" />]}
            >
              {/* <p>Active Courses: {stats.activeCourseCount ?? 0}</p> */}
            </Card>
          </Link>
        </Col>
      </Row>

      {/* Pronunciation Section */}
      <Title level={4} className="mt-6">🗣️ Pronunciation Practice</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to={paths.CREATE_SPEECH_PRACTISE}>
            <Card
              hoverable
              title="Add Pronunciation"
              actions={[<PlusCircleOutlined key="add-speech" />]}
            >
              {/* <p>Total Sets: {stats.pronunciationCount ?? 0}</p> */}
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to={paths.MANAGE_SPEECH_PRACTISE}>
            <Card
              hoverable
              title="View Pronunciations"
              actions={[<SoundOutlined key="view-speech" />]}
            >
              <p>Practice Sets Available</p>
            </Card>
          </Link>
        </Col>
      </Row>

      {/* User Management */}
      <Title level={4} className="mt-6">👥 User Management</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Link to={paths.ADMIN_USER_TABLE}>
            <Card
              hoverable
              title="View All Users"
              actions={[<UserOutlined key="users" />]}
            >
              <p>Manage students and their progress</p>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

function DashboardCard({ title, icon, value, color = "blue", link }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    green: "bg-green-100 text-green-800 border-green-300",
    orange: "bg-orange-100 text-orange-800 border-orange-300",
    purple: "bg-purple-100 text-purple-800 border-purple-300",
    red: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <Link to={link}>
      <div
        className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${colorMap[color]} cursor-pointer`}
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-xl font-bold mt-1">{value}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}


export default AdminDashboard;

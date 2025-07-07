import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { Bar } from 'react-chartjs-2';
import {
  BookOpen,
  FileText,
  Volume2,
  PlusCircle,
} from "lucide-react";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { paths } from '../../lib/path';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
    <div className="admin-dashboard">
      <h2>📊 Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Grammar Lessons"
          value={stats.grammarCount}
          icon={<FileText />}
          color="blue"
          link={null}
        />
        <DashboardCard
          title="Vocabulary"
          value={stats.vocabCount}
          icon={<BookOpen />}
          color="green"
        />
        <DashboardCard
          title="Stories"
          value={stats.storyCount}
          icon={<Volume2 />}
          color="orange"
        />
        <DashboardCard
          title="Add Course"
          value={stats.pronunciationCount}
          icon={<PlusCircle />}
          color="purple"
          link ={paths.ADD_COURSE}
        />
         <DashboardCard
          title="View Courses"
          value={stats.pronunciationCount}
          // icon={<PlusCircle />}
          color="red"
          link ={paths.COURSES}
        />
      </div>I

      <div className="dashboard-chart">
        <h3 className="mt-4 mb-3">📈 Content Overview</h3>
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
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

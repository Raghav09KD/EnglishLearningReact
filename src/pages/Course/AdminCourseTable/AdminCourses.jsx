import { Table, Tag, Button, Tooltip, Space, message, Progress, Typography } from "antd";
import { EditOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllCourses, getCourseById, updateCourseByIdAPI } from "../coursesHelper";
import { paths } from '../../../lib/path';
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function AdminCoursesTable() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      console.log("Fetched Courses:", data);
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      message.error("Error fetching course list");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEditCourse = async (course) => {
    try {
      const res = await getCourseById(course._id);
      navigate(paths.ADD_COURSE, { state: { course: res } });
    } catch (err) {
      console.error("Error fetching course for edit:", err);
      message.error("Error fetching course");
    }
  };

  const handleToggleActive = async (course) => {
    try {
      const updatedCourse = { ...course, isActive: !course.isActive };
      const res = await updateCourseByIdAPI(course._id, updatedCourse);
      message.success(`Course ${updatedCourse.isActive ? "activated" : "disabled"} successfully`);

      // Update the local state without refetching
      setCourses((prevCourses) =>
        prevCourses.map((c) =>
          c._id === course._id ? { ...c, isActive: updatedCourse.isActive } : c
        )
      );
    } catch (error) {
      console.error("Error toggling course status:", error);
      message.error("Failed to update course status");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ellipsis: true,
      responsive: ["xs", "sm", "md", "lg"], // always shown
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "volcano"}>
          {isActive ? "Active" : "Disabled"}
        </Tag>
      ),
      filters: [
        { text: "Active", value: true },
        { text: "Disabled", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      align: "center",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Sections",
      dataIndex: "totalCount",
      key: "totalCount",
      align: "center",
      responsive: ["md", "lg"],
    },
    {
      title: "Completed",
      dataIndex: "completedCount",
      key: "completedCount",
      align: "center",
      responsive: ["md", "lg"],
    },
    {
      title: "Progress",
      dataIndex: "percentage",
      key: "percentage",
      align: "center",
      sorter: (a, b) => a.percentage - b.percentage,
      render: (percentage) => (
        <Progress
          percent={percentage}
          size="small"
          status={percentage === 100 ? "success" : "active"}
        />
      ),
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Edit course details">
            <Button
              type="default"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditCourse(record)}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip
            title={record.isActive ? "Disable course" : "Activate course"}
          >
            <Button
              danger={record.isActive}
              type={record.isActive ? "default" : "primary"}
              icon={
                record.isActive ? <StopOutlined /> : <CheckCircleOutlined />
              }
              size="small"
              onClick={() => handleToggleActive(record)}
            >
              {record.isActive ? "Disable" : "Activate"}
            </Button>
          </Tooltip>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full overflow-x-auto">
      <Title level={4} className="mb-4 text-gray-800">
        All Courses
      </Title>
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="_id"
        pagination={{ pageSize: 6, showSizeChanger: false }}
        bordered
        size="middle"
        scroll={{ x: true }} // makes it responsive for small screens
      />
    </div>
  );
}

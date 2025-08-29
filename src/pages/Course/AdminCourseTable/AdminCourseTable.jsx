import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Button, Space, Tooltip, message } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import request from "../../../lib/api/request";
import { useNavigate } from "react-router-dom";
import { getCourseById } from "../coursesHelper"
import { paths } from "../../../lib/path";

const { Title } = Typography;

const AdminCourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleFetchAllCourses = async () => {
    try {
      setLoading(true);
      const res = await request({
        method: "get",
        url: "/admin/fetchAllCourses",
        auth: true,
      });
      setCourses(res);
      console.log("Fetched courses:", res);
    } catch (error) {
      console.error("Error fetching all courses:", error);
      message.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchAllCourses();
  }, []);


  const handleEditCourse = async (course) => {
    try {
      const res = await getCourseById(course._id);
      navigate(paths.ADD_COURSE, {
        state: {
          course: res,
          readOnlyFields: ['title', 'description'],
        }
      });
    } catch (err) {
      console.error("Error fetching course for edit:", err);
      message.error("Error fetching course");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit course">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditCourse(record)}
            >
              Edit
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <Title level={3} className="mb-4">All Courses</Title>

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={courses}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 8 }}
          bordered
        />
      )}
    </div>
  );
};

export default AdminCourseTable;

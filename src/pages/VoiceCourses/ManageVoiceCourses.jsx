import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Tag, message } from "antd";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import request from "../../lib/api/request";
import { useGlobalMessage } from "../../components/MessageProvider/MessageProvider";

const AdminVoiceCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const message = useGlobalMessage();
    // Fetch courses
    const fetchCourses = async () => {
        try {
            setLoading(true);

            const res = await request({
                url: '/voicePractise/getAllListeningCourse',
                auth: true,
                method: 'get'
            })
            setCourses(res);
        } catch (err) {
            console.error(err);
            message.error("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Toggle course active status
    const toggleStatus = async (courseId, isActive) => {
        try {

            await request({
                url: `/voicePractise/toggle/${courseId}`,
                method: 'patch',
                data: { isActive: !isActive, },
                auth: true
            })

            message.success("Course status updated");
            fetchCourses();
        } catch (err) {
            message.error("Failed to update course status");
        }
    };

    // Delete course
    const deleteCourse = async (courseId) => {
        try {
            await request({
                url: `/voicePractise/${courseId}`,
                method: 'delete',
                auth: true
            })
            // await axios.delete(`/api/voiceCourses/${courseId}`);
            message.success("Course deleted successfully");
            fetchCourses();
        } catch (err) {
            message.error("Failed to delete course");
        }
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        // {
        //     title: "Description",
        //     dataIndex: "description",
        //     key: "description",
        //     ellipsis: true,
        // },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive) =>
                isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => toggleStatus(record._id, record.isActive)}
                    >
                        {record.isActive ? "Deactivate" : "Activate"}
                    </Button>

                    <Popconfirm
                        title="Are you sure to delete this course?"
                        onConfirm={() => deleteCourse(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold mb-6">🎙️ Manage Voice Courses</h2>
            <Table
                columns={columns}
                dataSource={courses}
                rowKey="_id"
                loading={loading}
                bordered
            />
        </div>
    );
};

export default AdminVoiceCourses;

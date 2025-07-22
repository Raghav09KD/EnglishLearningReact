import { Table, Tag, Button, Tooltip, Space } from "antd";
import { EditOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllCourses, getCourseById, updateCourseByIdAPI } from "../coursesHelper";
import { paths } from '../../../lib/path';
import { useNavigate } from "react-router-dom";

export default function AdminCoursesTable({ }) {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
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
        },
        {
            title: "Total Sections",
            dataIndex: "totalCount",
            key: "totalCount",
            align: "center",
        },
        {
            title: "Completed Count",
            dataIndex: "completedCount",
            key: "completedCount",
            align: "center",
        },
        {
            title: "Progress",
            dataIndex: "percentage",
            key: "percentage",
            render: (percentage) => `${percentage}%`,
            align: "center",
            sorter: (a, b) => a.percentage - b.percentage,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit course details">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => handleEditCourse(record)}
                        >
                            Edit
                        </Button>
                    </Tooltip>
                    <Tooltip title={record.isActive ? "Disable course" : "Activate course"}>
                        <Button
                            danger={!record.isActive}
                            type={record.isActive ? "default" : "primary"}
                            icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
                        // onClick={() => onToggleActive(record)}
                        >
                            {record.isActive ? "Disable" : "Activate"}
                        </Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses();
                setCourses(data);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        };

        fetchCourses();
        handleGetCourseById('686cd9ef397cce7aa63ff530');
    }, []);

    const handleEditCourse = async (course) => {
        const res = await getCourseById(course?._id);
        navigate(paths.ADD_COURSE, { state: { course: res } });
    };

    const handleGetCourseById = async (id) => {
        try {
            const res = await getCourseById(id);
            console.log("🚀 ~ handleGetCourseById ~ res:", res)
        } catch (error) {
            console.error("Error fetching course by ID:", error);

        }
    }



    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">All Courses</h2>
            <Table
                columns={columns}
                dataSource={courses}
                rowKey="_id"
                pagination={{ pageSize: 6 }}
                bordered
            />
        </div>
    );
}

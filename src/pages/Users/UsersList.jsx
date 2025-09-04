import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, Space, Tooltip, Button, Input } from "antd";
import { EyeOutlined, StopOutlined } from '@ant-design/icons';
import request from "../../lib/api/request";
import { SearchOutlined } from "@ant-design/icons";
import UserProgressDrawer from "./UserProgressDrawer";

const { Title } = Typography;

const AdminUserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserProgress, setSelectedUserProgress] = useState([]);
    const [listeningProgress, setListeningProgress] = useState([]);
    const [speechProgress, setSpeechProgress] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchText, setSearchText] = useState("");


    const handleFetchAllUsers = async () => {
        try {
            setLoading(true);
            const res = await request({
                method: "get",
                url: "/admin/fetchAllUsers",
                auth: true
            });
            setUsers(res);
            console.log("Fetched users:", res);
        } catch (error) {
            console.error("Error fetching all users:", error);
            // Handle error appropriately, e.g., show a notification
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleFetchAllUsers();
    }, []);

    const handleViewProgress = async (user) => {
        const res = await request({
            method: "get",
            url: `/admin/progress?userId=${user._id}`,
            auth: true
        });
        setSelectedUserProgress({ user, courseProgress: res });
        setDrawerOpen(true);
        getVoiseProgress(user);
        getSpeechScoress(user);
    };


    const getVoiseProgress = async (user) => {
        try {
            const res = await request({
                method: "post",
                url: `/voicePractise/viewProgressForUsr`,
                data: { userId: user?._id },
                auth: true
            });
            setListeningProgress(res);
            console.log("res ++++>", res)
        } catch (error) {

        }

    }


    const getSpeechScoress = async (user) => {
        try {
            const res = await request({
                method: "post",
                url: `/speechPractise/getProgressForUsr`,
                data: { userId: user?._id },
                auth: true
            });
            setSpeechProgress(res);
            console.log("ressss", res)
        } catch (error) {

        }
    }


    const handleToggleUserStatus = async (userId) => {
        try {
            console.log("Toggling user status for ID:", userId);
            const res = await request({
                method: "patch",
                url: "/user/toggle-user",
                data: { userId },
                auth: true
            });
            console.log("User status toggled:", res);
            handleFetchAllUsers();
        } catch (error) {
            console.error("Error toggling user status:", error);
        }
    }

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a?.name?.localeCompare(b?.name),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            responsive: ['md'],
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => (
                <Tag color={role === "teacher" ? "geekblue" : "green"}>
                    {role?.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: "Student", value: "student" },
                { text: "Teacher", value: "teacher" },
            ],
            onFilter: (value, record) => record?.role === value,
        },
        {
            title: "Registered On",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            responsive: ['lg'],
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View detailed progress">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewProgress(record)}
                        >
                            View
                        </Button>
                    </Tooltip>


                    <Tooltip title={record.isActive ? "Deactivate this user" : "Activate this user"}>
                        <Button
                            type={record.isActive ? "default" : "primary"}
                            danger={record.isActive}
                            icon={<StopOutlined />}
                            onClick={() => handleToggleUserStatus(record._id)}
                        >
                            {record.isActive ? "Deactivate" : "Activate"}
                        </Button>
                    </Tooltip>

                </Space>
            ),
        }
    ];

    const filteredUsers = users.filter((user) => {
        const search = searchText.toLowerCase();
        return (
            user?.name?.toLowerCase().includes(search) ||
            user?.email?.toLowerCase().includes(search) ||
            user?.role?.toLowerCase().includes(search) ||
            new Date(user?.createdAt).toLocaleDateString().includes(search)
        );
    });



    return (
        <div className="p-4 bg-white rounded shadow-md">
            <Title level={3} className="mb-4">All Registered Users</Title>

            <Input
                placeholder="Search by name, email, role or date"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: "100%" }}
            />

            {loading ? (
                <div className="text-center py-10">
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={filteredUsers}
                    // dataSource={users}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 8 }}
                    bordered
                />
            )}

            <UserProgressDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                userData={selectedUserProgress}
                speechProgress={speechProgress}
                listeningProgress={listeningProgress}
            />
        </div>
    );
};

export default AdminUserTable;

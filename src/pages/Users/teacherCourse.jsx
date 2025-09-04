import React, { useEffect, useState } from "react";
import {
    Table,
    Card,
    Row,
    Col,
    Button,
    Modal,
    Transfer,
    Typography,
    message,
} from "antd";
import request from "../../lib/api/request";
// import TabPane from "antd/es/tabs/TabPane";
import { Tabs } from "antd";


const { Title } = Typography;
const { TabPane } = Tabs;


const TeacherCourseManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [activeTab, setActiveTab] = useState("1");
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignedCourseIds, setAssignedCourseIds] = useState([]);
    const [loading, setLoading] = useState(false);

    // 📌 Fetch Teachers
    const fetchData = async () => {
        try {
            setLoading(true);
            const users = await request({
                method: "get",
                url: "/admin/fetchAllUsers",
                auth: true,
            });
            setTeachers(users.filter((u) => u.role === "teacher"));
        } catch (err) {
            console.error(err);
            message.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // 📌 Fetch Courses by Type
    const fetchDefaultCourses = async () => {
        try {
            const res = await request({
                method: "get",
                url: "/admin/fetchAllGlobalCourses",
                auth: true,
            });
            setCourses(res);
        } catch {
            setCourses([]);
        }
    };

    const fetchAllVoiceCourses = async () => {
        try {
            const res = await request({
                method: "get",
                url: "/voicePractise/fetchAllGlobal",
                auth: true,
            });
            setCourses(res);
        } catch {
            setCourses([]);
        }
    };

    const fetchAllSpeechCourses = async () => {
        try {
            const res = await request({
                method: "get",
                url: "/speechPractise/fetchAllGlobal",
                auth: true,
            });
            setCourses(res);
        } catch {
            setCourses([]);
        }
    };

    // 📌 Run once
    useEffect(() => {
        fetchData();
    }, []);

    // 📌 Handle tab change
    useEffect(() => {
        if (!selectedTeacher) return;
        console.log(selectedTeacher)

        switch (activeTab) {
            case "1":
                fetchDefaultCourses();
                setTeacherCourses(selectedTeacher?.courses || []);
                break;
            case "2":
                fetchAllVoiceCourses();
                setTeacherCourses(selectedTeacher?.voiceCourses || []);
                break;
            case "3":
                fetchAllSpeechCourses();
                setTeacherCourses(selectedTeacher?.speechCourses || []);
                break;
            default:
                break;
        }
    }, [activeTab, selectedTeacher]);

    // 📌 Assign Courses
    const handleAssign = async () => {
        let courseType =
            activeTab === "1"
                ? "courses"
                : activeTab === "2"
                    ? "voiceCourses"
                    : "speechCourses";

        const currentCount = (teacherCourses?.length || 0);
        if (currentCount + assignedCourseIds.length > 10) {
            message.error("You cannot assign more than 10 courses to this teacher.");
            return;
        }

        try {
            await request({
                method: "post",
                url: "/admin/assignCourses",
                data: {
                    teacherId: selectedTeacher._id,
                    courseIds: assignedCourseIds,
                    courseType,
                },
            });

            message.success("Courses assigned successfully");
            setIsAssignModalOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
            message.error("Failed to assign courses");
        }
    };

    // 📌 Remove Course
    const handleRemoveCourse = async (teacherId, courseId) => {
        let courseType =
            activeTab === "1"
                ? "courses"
                : activeTab === "2"
                    ? "voiceCourses"
                    : "speechCourses";

        try {
            await request({
                method: "post",
                url: "/admin/removeCourse",
                data: { teacherId, courseId, courseType },
            });

            setTeacherCourses((prev) =>
                prev.filter((c) => (c._id || c) !== courseId)
            );

            message.success("Course removed");
            fetchData();
        } catch (err) {
            console.error(err);
            message.error("Failed to remove course");
        }
    };

    const openAssignModal = (teacher) => {
        setSelectedTeacher(teacher);

        const selected =
            activeTab === "1"
                ? teacher.courses
                : activeTab === "2"
                    ? teacher.voiceCourses
                    : teacher.speechCourses;

        setAssignedCourseIds(selected?.map((c) => c._id || c) || []);
        setIsAssignModalOpen(true);
    };

    // 📌 Stats
    const totalTeachers = teachers?.length;
    const totalCourses = courses?.length;
    const assignedCourses = teacherCourses?.length || 0;
    const unassignedCourses = totalCourses - assignedCourses;

    return (
        <div className="p-6">
            <Title level={3}>Teacher & Course Management</Title>

            {/* Stats */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false}>👩‍🏫 Teachers: {totalTeachers}</Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false}>📚 Courses: {totalCourses}</Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false}>⚠️ Unassigned: {unassignedCourses}</Card>
                </Col>
            </Row>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Courses" key="1" />
                <TabPane tab="Voice Courses" key="2" />
                <TabPane tab="Speech Courses" key="3" />
            </Tabs>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12}>
                    <Card title="Teachers" bordered={false}>
                        <Table
                            rowKey="_id"
                            loading={loading}
                            dataSource={teachers}
                            pagination={{ pageSize: 5 }}
                            columns={[
                                { title: "Name", dataIndex: "name" },
                                { title: "Email", dataIndex: "email" },
                                {
                                    title: "Courses",
                                    render: (teacher) => {
                                        if (activeTab === "1") return teacher.courses?.length || 0;
                                        if (activeTab === "2") return teacher.voiceCourses?.length || 0;
                                        return teacher.speechCourses?.length || 0;
                                    },
                                },
                                {
                                    title: "Actions",
                                    render: (teacher) => (
                                        <>
                                            <Button type="link" onClick={() => setSelectedTeacher(teacher)}>
                                                View
                                            </Button>
                                            <Button type="link" onClick={() => openAssignModal(teacher)}>
                                                Assign
                                            </Button>
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={12}>
                    {selectedTeacher && (
                        <Card title={`Courses of ${selectedTeacher.name}`} bordered={false}>
                            <Table
                                rowKey={(record) => record._id}
                                dataSource={teacherCourses}
                                pagination={false}
                                columns={[
                                    { title: "Course Name", dataIndex: "title" },
                                    { title: "Description", dataIndex: "description" },
                                    {
                                        title: "Actions",
                                        render: (course) => (
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() =>
                                                    handleRemoveCourse(selectedTeacher._id, course._id)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        ),
                                    },
                                ]}
                            />
                        </Card>
                    )}
                </Col>
            </Row>

            {/* Assign Courses Modal */}
            <Modal
                title={`Assign Courses to ${selectedTeacher?.name}`}
                open={isAssignModalOpen}
                onOk={handleAssign}
                onCancel={() => {
                    setIsAssignModalOpen(false);
                    setAssignedCourseIds([]);
                }}
                okText="Save"
                width={window.innerWidth < 768 ? "90%" : "500px"}
            >
                <Transfer
                    dataSource={courses.map((c) => ({
                        key: c._id,
                        title: c.title,
                    }))}
                    targetKeys={assignedCourseIds}
                    onChange={(nextKeys) => setAssignedCourseIds(nextKeys)}
                    render={(item) => item.title}
                    listStyle={{ width: 220, height: 300 }}
                />
            </Modal>
        </div>
    );
};

export default TeacherCourseManagement;

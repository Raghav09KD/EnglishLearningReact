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
import { apiPaths } from "../../lib/api/apiPath"; 

const { Title } = Typography;

const TeacherCourseManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignedCourseIds, setAssignedCourseIds] = useState([]);
    const [loading, setLoading] = useState(false);

    // 📌 Fetch Teachers + Courses
    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch teachers and courses from API
            const users = await request({
                method: "get",
                url: "/admin/fetchAllUsers",
                auth: true,
            });

            const courseRes = await request({
                method: "get",
                url: "/admin/fetchAllCourses",
                auth: true,
            });

            const teachers = users.filter((u) => u.role === "teacher");

            setTeachers(teachers);
            setCourses(courseRes);
        } catch (err) {
            console.error(err);
            message.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 📌 Assign Courses
    const handleAssign = async () => {
        const currentCourseCount = selectedTeacher.courses?.length || 0;

        // Check if we are assigning more than 10 courses
        if (currentCourseCount + assignedCourseIds.length > 10) {
            message.error("You cannot assign more than 10 courses to this teacher.");
            alert("You cannot assign more than 10 courses to this teacher")
            return; // Prevent further action if more than 10 courses are being assigned
        }

        try {
            // Proceed with assigning courses if under the limit
            await request({
                method: "post",
                url: "/admin/assignCourses",
                data: {
                    teacherId: selectedTeacher._id,
                    courseIds: assignedCourseIds,
                },
            });

            // Update selected teacher's courses after assignment
            const updatedCourses = courses.filter((c) =>
                assignedCourseIds.includes(c._id)
            );

            setSelectedTeacher((prev) => ({
                ...prev,
                courses: updatedCourses,
            }));

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
        try {
            await request({
                method: "post",
                url: "/admin/removeCourse",
                data: { teacherId, courseId },
            });

            setSelectedTeacher((prev) => ({
                ...prev,
                courses: prev.courses.filter((c) => c._id !== courseId),
            }));

            message.success("Course removed");
            fetchData();
        } catch (err) {
            console.error(err);
            message.error("Failed to remove course");
        }
    };

    // 📌 Stats
    const totalTeachers = teachers?.length;
    const totalCourses = courses?.length;
    const assignedCourses = teachers?.reduce(
        (acc, t) => acc + (t.courses?.length || 0),
        0
    );
    const unassignedCourses = totalCourses - assignedCourses;

    useEffect(() => {
        if (selectedTeacher && selectedTeacher.courses?.length > 0) {
            if (typeof selectedTeacher.courses[0] === "string") {
                const resolvedCourses = selectedTeacher.courses
                    .map(courseId => courses.find(s => s._id === courseId))
                    .filter(Boolean);

                setSelectedTeacher(prev => ({
                    ...prev,
                    courses: resolvedCourses
                }));
            }
        }
    }, [selectedTeacher?._id, courses]);

    const openAssignModal = (teacher) => {
        console.log("Courses for Teacher:", teacher.courses);

        setAssignedCourseIds([]);
        setSelectedTeacher(teacher);
        setAssignedCourseIds(teacher.courses?.map((c) => c._id || c) || []);
        setIsAssignModalOpen(true);
    };

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
                                    render: (teacher) => teacher.courses?.length || 0,
                                },
                                {
                                    title: "Actions",
                                    render: (teacher) => (
                                        <>
                                            <Button
                                                type="link"
                                                onClick={() => {
                                                    if (selectedTeacher && selectedTeacher._id === teacher._id) {
                                                        return;
                                                    }
                                                    setSelectedTeacher(teacher)
                                                }}                                            >
                                                View
                                            </Button>
                                            <Button
                                                type="link"
                                                onClick={() => openAssignModal(teacher)}
                                            >
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
                                dataSource={selectedTeacher.courses}
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
                    dataSource={courses
                        ?.filter((c) => !c.teacher) // Only unassigned courses
                        .map((c) => ({
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

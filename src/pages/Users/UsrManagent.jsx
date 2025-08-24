import React, { useEffect, useState } from "react";
import {
    Table,
    Card,
    Row,
    Col,
    Button,
    Modal,
    Transfer,
    Popconfirm,
    Typography,
    message,
} from "antd";
import request from "../../lib/api/request"; // <- your API request util
import { apiPaths } from "../../lib/api/apiPath"; // <- your API paths

const { Title } = Typography;

const TeacherStudentManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    console.log("🚀 ~ TeacherStudentManagement ~ selectedTeacher:", selectedTeacher)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assignedStudentIds, setAssignedStudentIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            const users = await request({
                method: "get",
                url: "/admin/fetchAllUsers",
                auth: true,
            });

            // 👉 Segregate based on role
            const teachers = users.filter((u) => u.role === "teacher");
            const students = users.filter((u) => u.role === "student");

            setTeachers(teachers);
            setStudents(students);

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

// 📌 Assign Students
const handleAssign = async () => {
    try {
        await request({
            method: "post",
            url: '/admin/assignStudents',
            data: {
                teacherId: selectedTeacher._id,
                studentIds: assignedStudentIds, // all selected IDs
            },
        });

        // 👉 Always replace with the current assignedStudentIds
        const updatedStudents = students
            .filter(s => assignedStudentIds.includes(s._id));

        setSelectedTeacher(prev => ({
            ...prev,
            students: updatedStudents, // overwrite, don't merge
        }));

        message.success("Students assigned successfully");
        setIsAssignModalOpen(false);

        fetchData(); // keep global stats/teacher list in sync
    } catch (err) {
        console.error(err);
        message.error("Failed to assign students");
    }
};



    // 📌 Remove Student
    const handleRemoveStudent = async (teacherId, studentId) => {
        try {
            await request({
                method: "post",
                url: '/admin/removeStudent',
                data: { teacherId, studentId },
            });

            // 👉 Immediately update selectedTeacher state so right-side table refreshes
            setSelectedTeacher(prev => ({
                ...prev,
                students: prev.students.filter(s => s._id !== studentId),
            }));

            message.success("Student removed");
            fetchData(); // still refresh global stats + teachers list
        } catch (err) {
            console.error(err);
            message.error("Failed to remove student");
        }
    };


    // 📌 Delete Teacher
    const handleDeleteTeacher = async (teacherId) => {
        try {
            await request({
                method: "delete",
                url: `${apiPaths.deleteTeacher}/${teacherId}`,
            });
            message.success("Teacher deleted");
            fetchData();
        } catch (err) {
            console.error(err);
            message.error("Failed to delete teacher");
        }
    };

    // 📌 Stats
    const totalTeachers = teachers?.length;
    const totalStudents = students?.length;
    const assignedStudents = teachers?.reduce(
        (acc, t) => acc + (t.students?.length || 0),
        0
    );
    const unassignedStudents = totalStudents - assignedStudents;

    useEffect(() => {
        if (selectedTeacher && selectedTeacher.students?.length > 0) {
            // Check if the first element is an ID (string) or object
            if (typeof selectedTeacher.students[0] === "string") {
                const resolvedStudents = selectedTeacher.students
                    .map(studentId => students.find(s => s._id === studentId))
                    .filter(Boolean);

                setSelectedTeacher(prev => ({
                    ...prev,
                    students: resolvedStudents
                }));
            }
        }
    }, [selectedTeacher?._id, students]);


    const openAssignModal = (teacher) => {
        setSelectedTeacher(teacher);
        setAssignedStudentIds(teacher.students?.map(s => s._id || s) || []);
        setIsAssignModalOpen(true);
    };

    console.log(assignedStudentIds)

    return (
        <div className="p-6">
            <Title level={3}>Teacher & Student Management</Title>

            {/* Stats */}
            <Row gutter={16} className="mb-6">
                <Col span={8}>
                    <Card bordered={false}>👩‍🏫 Teachers: {totalTeachers}</Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>👨‍🎓 Students: {totalStudents}</Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>⚠️ Unassigned: {unassignedStudents}</Card>
                </Col>
            </Row>

            <Row gutter={16}>
                {/* Teachers Table */}
                <Col span={12}>
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
                                    title: "Students",
                                    render: (teacher) => teacher.students?.length || 0,
                                },
                                {
                                    title: "Actions",
                                    render: (teacher) => (
                                        <>
                                            <Button
                                                type="link"
                                                onClick={() => setSelectedTeacher(teacher)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                type="link"
                                                onClick={() => openAssignModal(teacher)}
                                            >
                                                Assign
                                            </Button>
                                            {/* <Popconfirm
                                                title="Delete teacher?"
                                                onConfirm={() => handleDeleteTeacher(teacher._id)}
                                            >
                                                <Button type="link" danger>
                                                    Delete
                                                </Button>
                                            </Popconfirm> */}
                                        </>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                </Col>

                {/* Students of Selected Teacher */}
                <Col span={12}>
                    {selectedTeacher && (
                        <Card
                            title={`Students of ${selectedTeacher.name}`}
                            bordered={false}
                        >
                            <Table
                                rowKey="_id"
                                dataSource={selectedTeacher.students}
                                pagination={false}
                                columns={[
                                    { title: "Name", dataIndex: "name" },
                                    { title: "Email", dataIndex: "email" },
                                    {
                                        title: "Actions",
                                        render: (student) => (
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() =>
                                                    handleRemoveStudent(selectedTeacher._id, student._id)
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

            {/* Assign Students Modal */}
            <Modal
                title={`Assign Students to ${selectedTeacher?.name}`}
                open={isAssignModalOpen}
                onOk={handleAssign}
                onCancel={() => setIsAssignModalOpen(false)}
                okText="Save"
            >
                <Transfer
                    dataSource={students
                        ?.filter((s) => !s.teacher) // only students with no teacher
                        .map((s) => ({
                            key: s._id,
                            title: s.name,
                        }))}
                    targetKeys={assignedStudentIds}   // 🔑 already selected students
                    onChange={(nextKeys) => setAssignedStudentIds(nextKeys)}
                    render={(item) => item.title}
                    listStyle={{ width: 220, height: 300 }}
                />
            </Modal>
        </div>
    );
};

export default TeacherStudentManagement;

import React, { use, useEffect, useMemo, useState } from "react";
import { Table, Button, Modal, Select, Tag, Popconfirm, Tabs } from "antd";
import { PlusOutlined, StopOutlined, DeleteOutlined } from "@ant-design/icons";
import request from "../../lib/api/request";
import { useGlobalMessage } from "../../components/MessageProvider/MessageProvider";

const { Option } = Select;
const { TabPane } = Tabs;

export default function TeacherCourseManager() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [restrictModalVisible, setRestrictModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // fetch students & courses
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);


  const assignedIds = useMemo(
    () => (selectedStudent?.visibleCourses || []).map(c => c?._id),
    [selectedStudent]
  );

  // Filter out already assigned
  const unassignedCourses = useMemo(
    () => courses?.filter(c => !assignedIds?.includes(c?._id)),
    [courses, assignedIds]
  );

  // Filter out already assigned
  const assignedCoursesList = useMemo(
    () => courses?.filter(c => assignedIds?.includes(c?._id)),
    [courses, assignedIds]
  );

  const fetchStudents = async () => {
    // TODO: Replace with API call

    try {
      const response = await request({
        url: '/user/getTeacherStudent',
        method: 'GET',
        auth: true,
      })
      setStudents(response);
    } catch (error) {

    }
    // setStudents([
    //   { _id: "1", name: "Alice", assigned: [], restricted: [] },
    //   { _id: "2", name: "Bob", assigned: [], restricted: [] },
    // ]);
  };

  const message = useGlobalMessage();

  const fetchCourses = async () => {

    try {
      const response = await request({
        url: '/courses/getCources?manage=true',
        method: 'GET',
        auth: true,
      })
      console.log("🚀 ~ fetchCourses ~ response:", response);
      setCourses(response);
    } catch (error) {
    }
  };

  const handleAssignCourse = async () => {
    if (!selectedStudent || !selectedCourse) return;
    // TODO: Call backend POST /assign-course
    message.success("Course assigned successfully");
    setAssignModalVisible(false);
  };

  const handleRestrictCourse = async () => {
    console.log("🚀 ~ handleRestrictCourse ~ selectedCourse:", selectedCourse)
    if (!selectedStudent || !selectedCourse) return;
    // TODO: Call backend POST /restrict-course
    try {
      const res = await request({
        url: '/courses/restrict-course',
        method: 'POST',
        data: {
          studentId: selectedStudent._id,
          courseId: selectedCourse,
        },
        auth: true,
      });
    } catch (error) {

    }
    message.success("Course restricted successfully");
    setRestrictModalVisible(false);
    fetchStudents();
  };

  const handleRemoveAssignment = async (studentId, courseId) => {
    // TODO: Call backend DELETE /assign-course
    const res = await request({
      url: '/courses/restrict-course',
      method: 'POST',
      data: {
        studentId: studentId,
        courseId: courseId,
      },
      auth: true,
    });
    message.success("Assignment removed");
    fetchStudents();
  };

  const handleRemoveRestriction = async (studentId, courseId) => {
    // TODO: Call backend DELETE /restrict-course
    try {
      const res = await request({
        url: '/courses/removeRestrict-course',
        method: 'POST',
        data: {
          studentId: studentId,
          courseId: courseId,
        },
        auth: true,
      });
      message.success("Restriction removed");
      fetchStudents();
    } catch (error) {
      console.log("🚀 ~ handleRemoveRestriction ~ error:", error);
    }
  };

  const studentColumns = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: "Assigned Courses",
      key: "assigned",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          {record?.visibleCourses?.map((c) => (
            <Tag
              key={c._id}
              color="green"
              closable
              onClose={() => handleRemoveAssignment(record._id, c._id)}
            >
              {c.title}
            </Tag>
          ))}
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedStudent(record);
              setAssignModalVisible(true);
            }}
          >
            Assign
          </Button>
        </div>
      ),
    },
    {
      title: "Restricted Courses",
      key: "restricted",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          {record?.restrictedCourses?.map((c) => (
            <Tag
              key={c._id}
              color="red"
              closable
              onClose={() => handleRemoveRestriction(record._id, c._id)}
            >
              {c.title}
            </Tag>
          ))}
          <Button
            type="dashed"
            danger
            size="small"
            icon={<StopOutlined />}
            onClick={() => {
              setSelectedStudent(record);
              setRestrictModalVisible(true);
            }}
          >
            Restrict
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Manage Courses for Students
      </h1>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Students" key="1">
          <Table
            columns={studentColumns}
            dataSource={students}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            className="bg-white shadow rounded-lg"
          />
        </TabPane>

        {/* <TabPane tab="Courses" key="2">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
              >
                <span className="font-medium text-gray-700">{course.title}</span>
                <Popconfirm
                  title="Are you sure you want to restrict this for all students?"
                  onConfirm={() => message.success("Course restricted globally")}
                >
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    size="small"
                  >
                    Restrict Globally
                  </Button>
                </Popconfirm>
              </div>
            ))}
          </div>
        </TabPane> */}
      </Tabs>

      {/* Assign Modal */}
      <Modal
        title={`Assign Course to ${selectedStudent?.name}`}
        open={assignModalVisible}
        onOk={handleAssignCourse}
        onCancel={() => setAssignModalVisible(false)}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select course"
          onChange={(value) => setSelectedCourse(value)}
        >
          {unassignedCourses?.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.title}
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Restrict Modal */}
      <Modal
        title={`Restrict Course for ${selectedStudent?.name}`}
        open={restrictModalVisible}
        onOk={handleRestrictCourse}
        onCancel={() => setRestrictModalVisible(false)}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select course"
          onChange={(value) => setSelectedCourse(value)}
        >
          {assignedCoursesList?.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.title}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}

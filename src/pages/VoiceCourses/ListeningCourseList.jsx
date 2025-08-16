import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Row, Col, Spin,message } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

import axios from "axios";
import { getAllListeningCourse } from "./voiceCourseHelper";
import { paths } from "../../lib/path";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const VoiceCoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await getAllListeningCourse();
      console.log("res", res);
      // Filter out disabled courses
      setCourses(res);
    } catch (err) {
      console.error(err);
      message.error("Failed to load voice courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStartCourse = (courseId) => {
    // Navigate to course page or start quiz
    navigate(paths.LISTENING_COURSE_DETAILS.replace(":id", courseId));
    message.success(`Starting course ID: ${courseId}`);
    // Example: navigate(`/voice-course/${courseId}`)
  };

  if (loading) {
    return <Spin style={{ display: "block", margin: "50px auto" }} />;
  }

  return (
    <div className="px-6 py-8 w-full">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <Title level={2} className="!mb-0 text-gray-800">
           Available Voice Courses
        </Title>
        <span className="text-gray-500 text-sm">{courses.length} courses</span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      ) : courses.length === 0 ? (
        <Text type="secondary">No courses found.</Text>
      ) : (
        <Row gutter={[24, 24]}>
          {courses.map((course) => (
            <Col xs={24} sm={12} lg={8} key={course._id}>
              <Card
                hoverable
                className="rounded-2xl shadow-md h-full flex flex-col justify-between"
                bodyStyle={{ padding: "20px" }}
              >
                <div className="flex-1 mb-4">
                  <Title level={4} className="!mb-1 text-gray-800">
                    {course.title}
                  </Title>
                  <Text type="secondary" className="text-sm">
                    {/* Optional: add duration/description here */}
                  </Text>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => handleStartCourse(course._id)}
                  >
                    Start
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default VoiceCoursesList;

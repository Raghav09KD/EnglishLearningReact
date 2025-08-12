import React, { useEffect, useState } from "react";
import { List, Button, Spin, message } from "antd";
import axios from "axios";
import { getAllListeningCourse } from "./voiceCourseHelper";
import { paths } from "../../lib/path";
import { useNavigate } from "react-router-dom";

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
    <List
      header={<h2>Available Voice Courses</h2>}
      bordered
      dataSource={courses}
      renderItem={(course) => (
        <List.Item
          actions={[
            <Button type="primary" onClick={() => handleStartCourse(course._id)}>
              Start
            </Button>,
          ]}
        >
          {course.title}
        </List.Item>
      )}
    />
  );
};

export default VoiceCoursesList;

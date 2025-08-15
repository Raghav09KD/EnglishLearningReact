import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllCourses, getCourseById } from "../coursesHelper";
import { Progress, Card, Typography } from "antd";
// import moment from "moment";

const { Title, Text } = Typography;

export default function CourcesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const levelFromQuery = searchParams.get("level");
  const selectedLevel = location.state?.level || levelFromQuery || null;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const params = selectedLevel ? { level: selectedLevel } : {};
        const data = await getAllCourses(params);
        console.log("🚀 ~ fetchCourses ~ data:", data)
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedLevel]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Title level={2}>📚 All Courses</Title>

      {loading ? (
        <Text type="secondary">Loading...</Text>
      ) : courses.length === 0 ? (
        <Text type="secondary">No courses found.</Text>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Link key={course._id} to={`/courses/${course._id}`}>
              <Card
                hoverable
                className="rounded-xl shadow-sm"
                bodyStyle={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="flex-1 mr-4">
                  <Title level={4} className="!mb-1">
                    {course?.title}
                  </Title>
                  <Text type="secondary" className="text-sm">
                    {/* Created on: {moment(course.createdAt).format("DD MMM YYYY")} */}
                  </Text>
                </div>

                <Progress
                  type="circle"
                  percent={course?.percentage || 0}
                  width={60}
                  strokeColor={course.percentage === 100 ? "#52c41a" : "#1890ff"}
                  format={(percent) => `${percent}%`}
                />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
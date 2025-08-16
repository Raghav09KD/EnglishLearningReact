import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllCourses, getCourseById } from "../coursesHelper";
import { Progress, Card, Typography,Row, Col } from "antd";
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
   <div className="px-6 py-8 w-full">
      <div className="mb-8 flex justify-between items-center">
        <Title level={2} className="!mb-0">
           All Courses
        </Title>
        <Text type="secondary">{courses.length} total</Text>
      </div>

      {loading ? (
        <Text type="secondary">Loading...</Text>
      ) : courses.length === 0 ? (
        <Text type="secondary">No courses found.</Text>
      ) : (
        <Row gutter={[24, 24]}>
          {courses.map((course) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={course._id}>
              <Link to={`/courses/${course._id}`}>
                <Card
                  hoverable
                  className="rounded-2xl shadow-md h-full flex flex-col justify-between"
                  bodyStyle={{ padding: "20px" }}
                >
                  <div>
                    <Title level={4} className="!mb-2 text-gray-800">
                      {course?.title}
                    </Title>
                    <Text type="secondary" className="text-sm">
                      Progress overview
                    </Text>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Progress
                      type="circle"
                      percent={course?.percentage || 0}
                      width={70}
                      strokeColor={
                        course.percentage === 100 ? "#52c41a" : "#1890ff"
                      }
                      format={(percent) => `${percent}%`}
                    />
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses, getCoursesForStudent } from "../coursesHelper";
import { Progress, Card, Typography, Row, Col, Button } from "antd";
import { AuthContext } from "../../../context/AuthContext";

const { Title, Text } = Typography;

export default function CoursesList() {
  const { user, logout } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let data = [];
        if (user.role === 'teacher' || user.role === 'admin') {
          data = await getAllCourses();
        } else {
          data = await getCoursesForStudent();
        }
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleFilterChange = (level) => {
    setSelectedLevel(level);

    if (level === "all") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter((course) => course.level === level));
    }
  };

  return (
    <div className="px-6 py-8 w-full">
      <div className="mb-6 flex justify-between items-center">
        <Title level={2} className="!mb-0">
          All Courses
        </Title>
        <Text type="secondary">{filteredCourses.length} total</Text>
      </div>

      {/* Filter buttons */}
      <div className="mb-8 flex gap-4">
        {["all", "easy", "medium", "hard"].map((level) => (
          <Button
            key={level}
            type={selectedLevel === level ? "primary" : "default"}
            onClick={() => handleFilterChange(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)} Courses
          </Button>
        ))}
      </div>

      {loading ? (
        <Text type="secondary">Loading...</Text>
      ) : filteredCourses.length === 0 ? (
        <Text type="secondary">No courses found.</Text>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredCourses.map((course) => (
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
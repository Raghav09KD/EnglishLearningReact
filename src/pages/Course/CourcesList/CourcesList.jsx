import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCourses } from "../coursesHelper";

export default function CourcesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">All Courses</h1>

      {loading ? (
        <p>Loading...</p>
      ) : courses?.length === 0 ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Link to={`/courses/${course._id}`}>
            <div
              key={course._id}
              className="p-5 border rounded-xl shadow bg-white hover:shadow-lg transition-all"

            >
              <h2 className="text-xl font-semibold mb-1">{course?.title}</h2>
              <p className="text-gray-600 text-sm mb-3">
                {course.createdAt}...
              </p>
      

              {/* <Link
                to={`/admin/courses/${course._id}`}
                className="inline-block mt-3 text-blue-600 hover:underline text-sm"
              >
                View / Edit →
              </Link> */}
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

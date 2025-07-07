import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../coursesHelper";

export default function AdminCourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <p className="p-6">Loading...</p>;

  const section = course.sections[selectedSectionIndex];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Sections</h2>
        {course?.section?.length > 1 && course?.sections?.map((s, i) => (
          <div
            key={i}
            onClick={() => setSelectedSectionIndex(i)}
            className={`cursor-pointer p-2 rounded mb-2 ${
              selectedSectionIndex === i
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {i + 1}. {s.title || `Untitled`}
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">{section?.title}</h1>
        <p className="mb-4 text-gray-700">{section?.content}</p>

        {section?.mediaUrl && (
          <p className="text-sm text-blue-600 mb-2">
            Media:{" "}
            <a href={section.mediaUrl} target="_blank" rel="noreferrer">
              {section.mediaUrl}
            </a>
          </p>
        )}

        {section?.speechPracticeText && (
          <p className="text-sm italic text-gray-500 mb-4">
            Practice Text: {section.speechPracticeText}
          </p>
        )}

        {/* Quiz Block */}
        {section?.quiz?.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Quiz</h2>
            {section.quiz.map((quiz, qi) => (
              <div key={qi} className="mb-4">
                <p className="font-medium mb-1">
                  Q{qi + 1}: {quiz.question}
                </p>
                <ul className="pl-5 list-disc text-sm">
                  {quiz.options.map((opt, oi) => (
                    <li
                      key={oi}
                      className={`${
                        oi === quiz.correctAnswer
                          ? "text-green-600 font-semibold"
                          : ""
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

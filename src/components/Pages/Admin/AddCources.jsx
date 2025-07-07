import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import Input from "../../ui/Input";
import request from "../../../lib/api/request";
import { apiPaths } from "../../../lib/api/apiPath";

export default function AdminAddCourse() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    sections: [],
  });

  const addSection = () => {
    setCourse((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          content: "",
          order: prev.sections.length + 1,
          quiz: [],
          speechPracticeText: "",
          mediaUrl: "",
        },
      ],
    }));
  };

  const removeSection = (index) => {
    const updated = [...course.sections];
    updated.splice(index, 1);
    setCourse({ ...course, sections: updated });
  };

const updateSection = (index, key, value) => {
  const updatedSections = [...course.sections];
  const updatedSection = { ...updatedSections[index], [key]: value };
  updatedSections[index] = updatedSection;
  setCourse({ ...course, sections: updatedSections });
};

  const addQuizToSection = (sectionIndex) => {
    const updated = [...course.sections];
    updated[sectionIndex].quiz.push({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
    setCourse({ ...course, sections: updated });
  };

  const updateQuizQuestion = (sectionIndex, quizIndex, key, value) => {
    const updated = [...course.sections];
    updated[sectionIndex].quiz[quizIndex][key] = value;
    setCourse({ ...course, sections: updated });
  };

  const updateQuizOption = (sectionIndex, quizIndex, optionIndex, value) => {
    const updated = [...course.sections];
    updated[sectionIndex].quiz[quizIndex].options[optionIndex] = value;
    setCourse({ ...course, sections: updated });
  };

const handleSubmit = async () => {
  try {
    console.log(course);
     const res = await request({
        method: "post",
        url: apiPaths.createCourse,
        data: course,
        auth: true, // or false if public
    });
    alert("Course created successfully!");
    console.log(res.data); // Optional: log response
  } catch (err) {
    console.error("Create course error:", err);
    alert("Error creating course.");
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Add New Course</h1>

      <div className="space-y-4">
        <label className="block font-medium">Course Title</label>
        <Input
          type="text"
          className="w-full border px-4 py-2 rounded"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
        />

        <label className="block font-medium">Course Description</label>
        <textarea
          className="w-full border px-4 py-2 rounded"
          rows="3"
          value={course.description}
          onChange={(e) =>
            setCourse({ ...course, description: e.target.value })
          }
        />
      </div>

      {course.sections.map((section, index) => (
        <div
          key={index}
          className="border p-4 rounded bg-gray-50 space-y-4 relative"
        >
          <button
            onClick={() => removeSection(index)}
            className="absolute top-3 right-3 text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>

          <h2 className="font-semibold text-lg">Section {index + 1}</h2>

          <div>
            <label className="block font-medium">Title</label>
            <Input
              className="w-full border px-3 py-2 rounded"
              value={section.title}
              onChange={(e) =>
                updateSection(index, "title", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block font-medium">Content</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              rows={4}
              value={section.content}
              onChange={(e) =>
                updateSection(index, "content", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block font-medium">Speech Practice Text</label>
            <Input
              className="w-full border px-3 py-2 rounded"
              value={section.speechPracticeText}
              onChange={(e) =>
                updateSection(index, "speechPracticeText", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block font-medium">Media URL</label>
            <Input
              className="w-full border px-3 py-2 rounded"
              value={section.mediaUrl}
              onChange={(e) =>
                updateSection(index, "mediaUrl", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Quiz Questions</h3>
            {section.quiz.map((quiz, quizIndex) => (
              <div
                key={quizIndex}
                className="p-3 border rounded bg-white space-y-2"
              >
                <label>Question</label>
                <Input
                  className="w-full border px-3 py-2 rounded"
                  value={quiz.question}
                  onChange={(e) =>
                    updateQuizQuestion(index, quizIndex, "question", e.target.value)
                  }
                />

                {[0, 1, 2, 3].map((optIdx) => (
                  <div key={optIdx}>
                    <label>Option {optIdx + 1}</label>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      value={quiz.options[optIdx]}
                      onChange={(e) =>
                        updateQuizOption(index, quizIndex, optIdx, e.target.value)
                      }
                    />
                  </div>
                ))}

                <label>Correct Answer (Index 0-3)</label>
                <Input
                  type="number"
                  min="0"
                  max="3"
                  className="w-full border px-3 py-2 rounded"
                  value={quiz.correctAnswer}
                  onChange={(e) =>
                    updateQuizQuestion(
                      index,
                      quizIndex,
                      "correctAnswer",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            ))}

            <button
              onClick={() => addQuizToSection(index)}
              className="flex items-center gap-2 text-blue-600 mt-2"
            >
              <Plus size={18} /> Add Quiz Question
            </button>
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addSection}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} /> Add Section
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Course
        </button>
      </div>
    </div>
  );
}

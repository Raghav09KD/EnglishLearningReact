import { useState } from "react";
import request from "../../../lib/api/request";
import { apiPaths } from "../../../lib/api/apiPath";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Form,
  Input,
  Button,
  Space,
  Card,
  Typography,
  Divider,
  InputNumber,
  Popconfirm,
  Select,
} from "antd";
import {
  PlusOutlined, DeleteOutlined, BookOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { updateCourseByIdAPI } from "../../../pages/Course/coursesHelper";
import { useGlobalMessage } from "../../MessageProvider/MessageProvider";
import { paths } from "../../../lib/path";

const { Title, Text } = Typography;

export default function AdminAddCourse({ onSubmit }) {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state?.course || null;

  const readOnlyFields = location.state?.readOnlyFields || [];


  const [course, setCourse] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        level: initialData.level || "easy",
      };
    }
    console.log("Initial Data:", initialData);
    return {
      title: "",
      description: "",
      level: "easy",
      sections: [],
    };

  });


  const message = useGlobalMessage();

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
      question: null,
      options: ["", "", "", ""],
      correctAnswer: 1,
    });
    setCourse({ ...course, sections: updated });
  };

  const updateQuizQuestion = (sectionIndex, quizIndex, key, value) => {
    const updated = [...course.sections];
    if (key === "correctAnswer") {
      updated[sectionIndex].quiz[quizIndex][key] = Number(value);
    } else {
      updated[sectionIndex].quiz[quizIndex][key] = value;
    }
    setCourse({ ...course, sections: updated });
  };


  const updateQuizOption = (sectionIndex, quizIndex, optionIndex, value) => {
    const updated = [...course.sections];
    updated[sectionIndex].quiz[quizIndex].options[optionIndex] = value;
    setCourse({ ...course, sections: updated });
  };

  const removeQuiz = (sectionIndex, quizIndex) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIndex].quiz.splice(quizIndex, 1);
    setCourse({ ...course, sections: updatedSections });
  };

  const handleUpdateCourse = async (updateCourse) => {
    try {
      const payload = {
        ...updateCourse,
        sections: (updateCourse.sections || []).map((sec, sIdx) => ({
          title: sec.title || "",
          content: sec.content || "",
          order: sIdx + 1,
          mediaUrl: sec.mediaUrl || "",
          speechPracticeText: sec.speechPracticeText || "",
          quiz: (sec.quiz || []).map(q => ({
            _id: q._id || null,
            question: q.question || "",
            options: (q.options && q.options.length === 4) ? q.options : ["", "", "", ""],
            correctAnswer: Number(q.correctAnswer) || 1,
          })),
        })),
      };
      const res = await updateCourseByIdAPI(updateCourse._id, payload);
      console.log("Updated course response:", res);
      return res;
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error);
      throw new Error("Error updating course");
    }
  };




  const handleSubmit = async () => {
    try {
      console.log(course);
      if (initialData) {
        await handleUpdateCourse(course);
        message.success("Course updated successfully!");
      } else {
        const res = await request({
          method: "post",
          url: apiPaths.createCourse,
          data: course,
          auth: true,
        });
        message.success("Course created successfully");

        console.log(res.data);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Create course error:", err);
      alert("Error creating course.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <Title level={3} className="!mb-1 !text-3xl font-semibold">
          {initialData ? "Edit Course" : "Create New Course"}
        </Title>
        <Text type="secondary" className="text-base">
          {initialData
            ? "Update details of your course and manage its content."
            : "Fill in the details below to create a new course."}
        </Text>
      </div>

      <Form layout="vertical" onFinish={handleSubmit} className="bg-white rounded-xl shadow-md p-6 lg:p-8">
        {/* BASIC INFO */}
        <Divider orientation="left">📘 Basic Information</Divider>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item label="Course Title" required>
            <Input
              placeholder="Enter course title"
              value={course.title}
              disabled={readOnlyFields.includes("title")}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Course Level" required>
            <Select
              value={course.level}
              onChange={(value) => setCourse({ ...course, level: value })}
              placeholder="Select course level"
            >
              <Select.Option value="easy">Easy</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="hard">Hard</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item label="Course Description" required>
          <Input.TextArea
            rows={4}
            placeholder="Provide a short description of the course"
            value={course.description}
            disabled={readOnlyFields.includes("title")}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
        </Form.Item>

        {/* SECTIONS */}
        <Divider orientation="left">📂 Course Sections</Divider>

        {course?.sections?.map((section, index) => (
          <Card
            key={index}
            className="mb-6 rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
            title={<span className="font-medium">Section {index + 1}: {section.title || "Untitled"}</span>}
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeSection(index)}
              />
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item label="Section Title" required>
                <Input
                  value={section.title}
                  onChange={(e) => updateSection(index, "title", e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Media URL">
                <Input
                  placeholder="Paste video or audio link"
                  value={section.mediaUrl}
                  onChange={(e) => updateSection(index, "mediaUrl", e.target.value)}
                />
              </Form.Item>
            </div>

            <Form.Item label="Content">
              <Input.TextArea
                rows={3}
                placeholder="Section content"
                value={section.content}
                onChange={(e) => updateSection(index, "content", e.target.value)}
              />
            </Form.Item>

            {/* QUIZ */}
            <Divider orientation="left">❓ Quiz Questions</Divider>
            {section.quiz.map((quiz, quizIndex) => (
              <Card
                key={quizIndex}
                size="small"
                className="mb-4 bg-white rounded-md border"
                title={`Question ${quizIndex + 1}`}
                extra={
                  <Popconfirm
                    title="Delete this quiz question?"
                    onConfirm={() => removeQuiz(index, quizIndex)}
                  >
                    <Button type="link" danger>Remove</Button>
                  </Popconfirm>
                }
              >
                <Form.Item label="Question">
                  <Input
                    value={quiz.question}
                    onChange={(e) =>
                      updateQuizQuestion(index, quizIndex, "question", e.target.value)
                    }
                  />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((optIdx) => (
                    <Form.Item key={optIdx} label={`Option ${optIdx + 1}`}>
                      <Input
                        value={quiz.options[optIdx]}
                        onChange={(e) =>
                          updateQuizOption(index, quizIndex, optIdx, e.target.value)
                        }
                      />
                    </Form.Item>
                  ))}
                </div>

                <Form.Item label="Correct Answer">
                  <Select
                    value={quiz.correctAnswer}
                    onChange={(val) =>
                      updateQuizQuestion(index, quizIndex, "correctAnswer", val)
                    }
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <Select.Option key={num} value={num}>{`Option ${num}`}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => addQuizToSection(index)}
              block
            >
              Add Quiz Question
            </Button>
          </Card>
        ))}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addSection}
          className="mb-6"
          block
        >
          Add Section
        </Button>

        <Divider />

        {/* SUBMIT */}
        <div className="text-center">
          <Button type="primary" htmlType="submit" size="large" className="px-10 rounded-lg">
            {initialData ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

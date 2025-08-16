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

const { Title, Text } = Typography;

export default function AdminAddCourse({ onSubmit }) {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state?.course || null;

  const [course, setCourse] = useState(
    initialData || {
      title: "",
      description: "",
      level: "easy", 
      sections: [],
    }
  );

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

  const removeQuiz = (sectionIndex, quizIndex) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIndex].quiz.splice(quizIndex, 1);
    setCourse({ ...course, sections: updatedSections });
  };

  const handleUpdateCourse = async (updateCourse) => {
    try {
      const res = await updateCourseByIdAPI(updateCourse?._id, updateCourse);
      console.log("🚀 ~ handleUpdateCourse ~ res:", res);
    } catch (error) {
      throw new Error("Error updating course:", error);
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
        alert("Course created successfully!");
        console.log(res.data);
      }
      navigate("/admin");
    } catch (err) {
      console.error("Create course error:", err);
      alert("Error creating course.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Title */}
      <div className="mb-6 text-center">
        <Title level={3} className="!mb-1 !text-2xl md:!text-3xl">
          {initialData ? "Edit Course" : "Create New Course"}
        </Title>
        <Text type="secondary" className="text-sm md:text-base">
          {initialData
            ? "Update details of your course and manage its content."
            : "Fill in the details below to create a new course."}
        </Text>
      </div>

      <Form
        layout="vertical"
        onFinish={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
      >
        {/* Course Title */}
        <Form.Item
          label={<span className="text-sm font-medium text-gray-700">Course Title</span>}
          required
        >
          <Input
            placeholder="Enter course title"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
            className="h-10 text-base"
          />
        </Form.Item>

        {/* Course Description */}
        <Form.Item
          label={<span className="text-sm font-medium text-gray-700">Course Description</span>}
          required
        >
          <Input.TextArea
            rows={4}
            placeholder="Provide a short description of the course"
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
            className="text-base"
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

        {course?.sections?.map((section, index) => (
          <Card
            key={index}
            title={
              <span className="text-gray-800 font-medium flex items-center gap-2">
                <BookOutlined className="text-indigo-500" /> Section {index + 1}
              </span>
            }
            className="mb-6 rounded-lg shadow-sm"
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeSection(index)}
              />
            }
          >
            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">Section Title</span>}
              required
            >
              <Input
                placeholder="Enter section title"
                value={section.title}
                onChange={(e) => updateSection(index, "title", e.target.value)}
                className="h-9 text-base"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-sm font-medium text-gray-700">Content</span>}
            >
              <Input.TextArea
                rows={3}
                placeholder="Section content"
                value={section.content}
                onChange={(e) =>
                  updateSection(index, "content", e.target.value)
                }
                className="text-base"
              />
            </Form.Item>

            <Form.Item label="Media URL">
              <Input
                placeholder="Paste video or audio link"
                value={section.mediaUrl}
                onChange={(e) =>
                  updateSection(index, "mediaUrl", e.target.value)
                }
                className="h-9 text-base"
              />
            </Form.Item>

            <Divider className="text-gray-500">Quiz Questions</Divider>

            {section.quiz.map((quiz, quizIndex) => (
              <Card
                key={quizIndex}
                size="small"
                className="mb-4 rounded-lg border border-gray-200"
                title={
                  <span className="text-gray-700 font-medium flex items-center gap-2">
                    <QuestionCircleOutlined className="text-indigo-500" /> Question{" "}
                    {quizIndex + 1}
                  </span>
                }
                extra={
                  <Popconfirm
                    title="Delete this quiz question?"
                    onConfirm={() => removeQuiz(index, quizIndex)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger className="text-sm">
                      Remove
                    </Button>
                  </Popconfirm>
                }
              >
                <Form.Item
                  label={<span className="text-sm font-medium text-gray-700">Question</span>}
                >
                  <Input
                    placeholder="Enter quiz question"
                    value={quiz.question}
                    onChange={(e) =>
                      updateQuizQuestion(
                        index,
                        quizIndex,
                        "question",
                        e.target.value
                      )
                    }
                    className="h-9 text-base"
                  />
                </Form.Item>

                {[0, 1, 2, 3].map((optIdx) => (
                  <Form.Item
                    key={optIdx}
                    label={
                      <span className="text-sm font-medium text-gray-700">
                        Option {optIdx + 1}
                      </span>
                    }
                  >
                    <Input
                      placeholder={`Enter option ${optIdx + 1}`}
                      value={quiz.options[optIdx]}
                      onChange={(e) =>
                        updateQuizOption(
                          index,
                          quizIndex,
                          optIdx,
                          e.target.value
                        )
                      }
                      className="h-9 text-base"
                    />
                  </Form.Item>
                ))}

                <Form.Item
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Correct Answer (1–4)
                    </span>
                  }
                >
                  <InputNumber
                    min={1}
                    max={4}
                    value={quiz.correctAnswer}
                    onChange={(val) =>
                      updateQuizQuestion(
                        index,
                        quizIndex,
                        "correctAnswer",
                        val
                      )
                    }
                    className="w-full"
                  />
                </Form.Item>
              </Card>
            ))}

            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => addQuizToSection(index)}
              block
              className="mt-2 h-10 text-base"
            >
              Add Quiz Question
            </Button>
          </Card>
        ))}

        {/* Add Section */}
        <Space className="block mb-6">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addSection}
            className="h-10 text-base"
          >
            Add Section
          </Button>
        </Space>

        <Divider />

        {/* Submit */}
        <Button
          type="primary"
          htmlType="submit"
          className="h-10 px-6 text-base rounded-md"
        >
          {initialData ? "Update Course" : "Create Course"}
        </Button>
      </Form>
    </div>
  );
}

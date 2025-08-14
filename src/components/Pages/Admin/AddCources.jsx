
import { useState } from "react";
import request from "../../../lib/api/request";
import { apiPaths } from "../../../lib/api/apiPath";
import { useNavigate } from "react-router-dom";


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
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { updateCourseByIdAPI } from "../../../pages/Course/coursesHelper";
import { useGlobalMessage } from "../../MessageProvider/MessageProvider";

const { Title } = Typography;

export default function AdminAddCourse({ onSubmit }) {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state?.course || null;
  console.log("🚀 ~ AdminAddCourse ~ location.state:", location.state)
  console.log("🚀 ~ AdminAddCourse ~ initialData:", initialData)
  const [course, setCourse] = useState(
    initialData || {
      title: "",
      description: "",
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
          auth: true, // or false if public
        });
        alert("Course created successfully!");
        console.log(res.data); // Optional: log response
      }

      // Redirect to admin dashboard
      navigate('/admin');

    } catch (err) {
      console.error("Create course error:", err);
      alert("Error creating course.");
    }
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
      // You can add logic to update the course in the state or notify the user
    } catch (error) {
      throw new Error("Error updating course:", error);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Title level={3}>
        {initialData ? "Edit Course" : "Create New Course"}
      </Title>

      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Course Title" required>
          <Input
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Course Description" required>
          <Input.TextArea
            rows={4}
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
        </Form.Item>

        {course?.sections?.map((section, index) => (
          <Card
            key={index}
            title={`Section ${index + 1}`}
            style={{ marginBottom: 24 }}
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeSection(index)}
              />
            }
          >
            <Form.Item label="Title" required>
              <Input
                value={section.title}
                onChange={(e) =>
                  updateSection(index, "title", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Content">
              <Input.TextArea
                rows={3}
                value={section.content}
                onChange={(e) =>
                  updateSection(index, "content", e.target.value)
                }
              />
            </Form.Item>

            {/* <Form.Item label="Speech Practice Text">
              <Input
                value={section.speechPracticeText}
                onChange={(e) =>
                  updateSection(index, "speechPracticeText", e.target.value)
                }
              />
            </Form.Item> */}

            <Form.Item label="Media URL">
              <Input
                value={section.mediaUrl}
                onChange={(e) =>
                  updateSection(index, "mediaUrl", e.target.value)
                }
              />
            </Form.Item>

            <Divider>Quiz Questions</Divider>

            {section.quiz.map((quiz, quizIndex) => (
              <Card
                key={quizIndex}
                size="small"
                style={{ marginBottom: 16 }}
                title={`Question ${quizIndex + 1}`}
                extra={
                  <Popconfirm
                    title="Are you sure to delete this quiz question?"
                    onConfirm={() => removeQuiz(index, quizIndex)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger className="text-red-600">
                      Remove
                    </Button>
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

                <Form.Item label="Correct Answer">
                  <InputNumber
                    min={1}
                    max={4}
                    value={quiz.correctAnswer}
                    onChange={(val) =>
                      updateQuizQuestion(index, quizIndex, "correctAnswer", val)
                    }
                  />
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

        <Space style={{ marginBottom: 24 }}>
          <Button type="dashed" icon={<PlusOutlined />} onClick={addSection}>
            Add Section
          </Button>
        </Space>

        <Divider />

        <Button type="primary" htmlType="submit">
          {initialData ? "Update Course" : "Create Course"}
        </Button>
      </Form>
    </div>
  );
}

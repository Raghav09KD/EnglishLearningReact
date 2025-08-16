import React, { useState, useEffect } from 'react';
import { Input, Button, Typography, Card, Form } from "antd";
import toast from 'react-hot-toast';
import { createSpeech } from './speechHelper';
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Title } = Typography;


const CreateSpeechPractice = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  // Fetch course list if needed
  useEffect(() => {
    // const fetchCourses = async () => {
    //   try {
    //     const res = await axios.get("/api/courses/getCources", {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //       },
    //     });
    //     setCourses(res.data);
    //   } catch (err) {
    //     console.error("Error fetching courses:", err);
    //   }
    // };

    // fetchCourses();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
      toast.error("Title and text are required.");
      return;
    }

    try {
      const payload = {
        title,
        text,
        ...(courseId && { courseId }),
      };

      const res = await createSpeech(payload);

      toast.success("Speech practice created!");
      setTitle("");
      setText("");
      setCourseId("");

      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error("Failed to create speech practice.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Card
        className="rounded-2xl shadow-md"
        bodyStyle={{ padding: "24px" }}
      >
        <Title level={4} className="mb-6 text-gray-800">
           Create Speech Practice
        </Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          {/* Title Input */}
          <Form.Item
            label="Practice Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input
              placeholder="Enter practice title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="large"
            />
          </Form.Item>

          {/* Paragraph Input */}
          <Form.Item
            label="Practice Text"
            rules={[
              { required: true, message: "Please enter text for practice" },
            ]}
          >
            <TextArea
              placeholder="Enter paragraph or sentence for pronunciation practice..."
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              size="large"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full rounded-lg"
            >
              Create Practice
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateSpeechPractice;
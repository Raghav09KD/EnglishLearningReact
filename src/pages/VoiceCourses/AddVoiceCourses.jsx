import React, { useState } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Upload,
    Divider,
    Popconfirm,
    InputNumber,
    message
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { addListeningPractiseAPI } from "./voiceCourseHelper";

export default function VoicePracticeForm() {
    const [quizList, setQuizList] = useState([]);
    const [mp3File, setMp3File] = useState(null);
    const [loading, setLoading] = useState(false);

    const addQuiz = () => {
        setQuizList([
            ...quizList,
            { question: "", options: ["", "", "", ""], correctAnswer: 1 }
        ]);
    };

    const removeQuiz = (quizIndex) => {
        setQuizList(quizList.filter((_, i) => i !== quizIndex));
    };

    const updateQuizQuestion = (quizIndex, field, value) => {
        const updated = [...quizList];
        updated[quizIndex][field] = value;
        setQuizList(updated);
    };

    const updateQuizOption = (quizIndex, optIdx, value) => {
        const updated = [...quizList];
        updated[quizIndex].options[optIdx] = value;
        setQuizList(updated);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            // Prepare form data for multipart/form-data request
            const formData = new FormData();
            formData.append("title", values.title.trim());

            if (mp3File) {
                formData.append("mp3File", mp3File); // must match multer field name
            } else {
                message.error("Please select an MP3 file before submitting");
                setLoading(false);
                return;
            }

            formData.append("quiz", JSON.stringify(quizList || []));

            console.log(token)

            const res = await axios.post("http://localhost:5000/api/voicePractise/add", formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },

            });

            console.log("Add listening practice response:", res);

            message.success("Voice course created successfully!");
            setQuizList([]);
            setMp3File(null);
        } catch (error) {
            console.error("Error creating voice course:", error);
            message.error("Failed to create voice course");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card title="Create Voice Practice Course" style={{ maxWidth: 800, margin: "auto" }}>
            <Form layout="vertical" onFinish={handleSubmit}>
                {/* Title */}
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please enter the course title" }]}
                >
                    <Input placeholder="Enter course title" />
                </Form.Item>

                {/* MP3 Upload */}
                <Form.Item label="MP3 File" required>
                    <Upload
                        accept=".mp3"
                        maxCount={1}
                        beforeUpload={(file) => {
                            setMp3File(file);
                            return false; // prevent auto upload
                        }}
                        onRemove={() => setMp3File(null)}
                    >
                        <Button icon={<UploadOutlined />}>Select MP3</Button>
                    </Upload>
                </Form.Item>

                {/* Quizzes */}
                <Divider>Quiz Questions</Divider>
                {quizList.map((quiz, quizIndex) => (
                    <Card
                        key={quizIndex}
                        size="small"
                        style={{ marginBottom: 16 }}
                        title={`Question ${quizIndex + 1}`}
                        extra={
                            <Popconfirm
                                title="Are you sure to delete this quiz question?"
                                onConfirm={() => removeQuiz(quizIndex)}
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
                                    updateQuizQuestion(quizIndex, "question", e.target.value)
                                }
                            />
                        </Form.Item>

                        {[0, 1, 2, 3].map((optIdx) => (
                            <Form.Item key={optIdx} label={`Option ${optIdx + 1}`}>
                                <Input
                                    value={quiz.options[optIdx]}
                                    onChange={(e) =>
                                        updateQuizOption(quizIndex, optIdx, e.target.value)
                                    }
                                />
                            </Form.Item>
                        ))}

                        <Form.Item label="Correct Answer (1-4)">
                            <InputNumber
                                min={1}
                                max={4}
                                value={quiz.correctAnswer}
                                onChange={(val) =>
                                    updateQuizQuestion(quizIndex, "correctAnswer", val)
                                }
                            />
                        </Form.Item>
                    </Card>
                ))}

                <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={addQuiz}
                    block
                >
                    Add Quiz Question
                </Button>

                {/* Submit */}
                <Form.Item style={{ marginTop: 20 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Course
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

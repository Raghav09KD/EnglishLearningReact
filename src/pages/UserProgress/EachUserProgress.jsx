import { Button, List, message, Modal, Tabs, Tag } from "antd";
import { use, useEffect, useState } from "react";
import request from "../../lib/api/request";
import { fetchProgress } from "../Course/SpeechRecognisation/speechHelper";
import { Card, Typography, Progress, Table, Collapse, Divider } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useLocation } from "react-router-dom";
import { fetchListeningProgress } from "../VoiceCourses/voiceCourseHelper";

import goldMedal from "../../assets/svgs/goldMedal.svg";
import silverMedal from "../../assets/svgs/silverMedal.svg";
import bronzeMedal from "../../assets/svgs/bronzeMedal.svg";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function EachUserProgress() {
    const location = useLocation();
    console.log("🚀 ~ EachUserProgress ~ location:", location)
    const [activeTab, setActiveTab] = useState("courses");
    console.log("🚀 ~ EachUserProgress ~ activeTab:", activeTab)
    const [courseProgress, setCourseProgress] = useState([]);
    const [speechScores, setSpeechScores] = useState([]);
    const [listeningScores, setListeningScores] = useState([]);

    const getMedalInfo = (medal) => {
        const map = {
            gold: { emoji: goldMedal, label: 'Gold' },
            silver: { emoji: silverMedal, label: 'Silver' },
            bronze: { emoji: bronzeMedal, label: 'Bronze' },
        };
        return map[medal] || null;
    };

    const { type } = location.state || {};
    console.log("🚀 ~ EachUserProgress ~ type:", type)

    const user = JSON.parse(localStorage.getItem('user'));
    console.log("🚀 ~ EachUserProgress ~ user:", user)

    const [modalVisible, setModalVisible] = useState(false);
    const [activeQuizDetails, setActiveQuizDetails] = useState([]);

    const showQuizDetails = (details) => {
        setActiveQuizDetails(details);
        setModalVisible(true);
    };

    const handleFethchUserProgress = async () => {
        try {
            const res = await request({
                method: "get",
                url: `/admin/progress?userId=${user.id}`,
                auth: true
            });
            setCourseProgress(res || []);
            console.log("🚀 ~ handleFethchUserProgress ~ res:", res)
        } catch (error) {
            message.error("Failed to fetch user progress. Please try again later")
        }

    }

    const handleFetchSpeechScore = async () => {
        try {
            const res = await fetchProgress();
            console.log("🚀 ~ handleFethchUserProgress ~ res:", res);
            setSpeechScores(res || []);
        } catch (error) {
            message.error("Failed to fetch user progress. Please try again later")
        }

    }

    const handleFetchListeningScore = async () => {
        try {
            const res = await fetchListeningProgress();
            console.log("🚀 ~ handleFetchListeningScore ~ res:", res);
            setListeningScores(res || []);
        } catch (error) {
            message.error("Failed to fetch user progress. Please try again later")
        }

    }

    useEffect(() => {
        handleFethchUserProgress();
        handleFetchSpeechScore();
        handleFetchListeningScore();
        // This effect can be used to fetch user-specific progress data
    }, []);

    useEffect(() => {
        if (type) {
            setActiveTab(type)
        }
    }, [type]);

    const courseColumns = [
        {
            title: "Section",
            dataIndex: "sectionIndex",
            key: "sectionIndex",
            render: (val) => `Section ${val + 1}`,
        },
        {
            title: "Score",
            dataIndex: "score",
            key: "score",
            render: (score) => <Progress percent={score} size="small" />,
        },
        {
            title: "Correct / Total",
            dataIndex: "correctAnswers",
            key: "correctAnswers",
            render: (_, record) => `${record.correctAnswers} / ${record.totalQuestions}`,
        },
        {
            title: "Attempted At",
            dataIndex: "attemptedAt",
            key: "attemptedAt",
            render: (val) => new Date(val).toLocaleString(),
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <Button onClick={() => showQuizDetails(record.details)} type="link">
                    View Details
                </Button>
            ),
        },
    ];

    const listeningColumns = [
        {
            title: "title",
            dataIndex: "sectionIndex",
            key: "sectionIndex",
            render: (val) => `Section ${val + 1}`,
        },
        {
            title: "Score",
            dataIndex: "score",
            key: "score",
            render: (score) => <Progress percent={score} size="small" />,
        },
        {
            title: "Correct / Total",
            dataIndex: "correctAnswers",
            key: "correctAnswers",
            render: (_, record) => `${record.correctAnswers} / ${record.totalQuestions}`,
        },
        {
            title: "Attempted At",
            dataIndex: "attemptedAt",
            key: "attemptedAt",
            render: (val) => new Date(val).toLocaleString(),
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <Button onClick={() => showQuizDetails(record.details)} type="link">
                    View Details
                </Button>
            ),
        },
    ];


    return (
        <Card >
            <QuizDetailsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                details={activeQuizDetails}
            />
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="📘 Courses" key="courses">
                    {/* Course Progress */}

                    <Card title={<Title level={4}>📘 Course Progress  </Title>} bordered>
                        <Collapse accordion>
                            {courseProgress.map((course, idx) => {
                                const medalInfo = getMedalInfo(course.medal);
                                return (
                                    <Panel
                                        header={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span>
                                                    {course.course.title} ({course.completedSections.length} / {course.currentSection} sections completed)
                                                </span>
                                                {course?.medal && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <img src={medalInfo?.emoji} alt="" width={20} />
                                                        <h3 className="text-xs font-semibold text-gray-500">{medalInfo?.label}</h3>
                                                    </span>
                                                )}
                                            </div>
                                        }
                                        key={idx}
                                    >
                                        <Table
                                            dataSource={course.quizScores.map((q, i) => ({ ...q, key: i }))}
                                            columns={courseColumns}
                                            pagination={false}
                                            size="small"
                                        />
                                    </Panel>
                                )
                            })}
                        </Collapse>
                    </Card>
                </TabPane>

                <TabPane tab="🗣️ Speech Practice" key="speech">
                    {/* Speech Progress */}
                    <Card title={<Title level={4}>🗣️ Speech Practice</Title>} bordered>
                        {speechScores.length === 0 ? (
                            <Text>No speech scores available</Text>
                        ) : (
                            speechScores.map((s, idx) => (
                                <Card
                                    key={idx}
                                    type="inner"
                                    title={`Score: ${s.score}% | ${new Date(s.createdAt).toLocaleString()}`}
                                    style={{ marginBottom: 12 }}
                                >
                                    <Text strong>Expected:</Text>
                                    <p style={{ color: '#888' }}>{s.expectedText}</p>
                                    <Text strong>Spoken:</Text>
                                    <p>{s.spokenText}</p>
                                    <Divider />
                                    <Progress
                                        percent={Math.round((s.correctWords / s.totalWords) * 100)}
                                        format={(p) => `${s.correctWords}/${s.totalWords} words correct`}
                                    />
                                </Card>
                            ))
                        )}
                    </Card>
                </TabPane>

                <TabPane tab="🎧 Listening Practice" key="listening">
                    <Card title={<Title level={4}>🎧 Listening Practice</Title>} bordered>
                        <Collapse accordion>
                            {listeningScores?.map((course, idx) => (
                                <Panel header={`${course?.courseTitle || 'NA'} — Score: ${course?.score}%`} key={idx}>
                                    {Array.isArray(course?.quizDetails) && course.quizDetails.map((quiz, qIdx) => (
                                        <div
                                            key={qIdx}
                                            style={{
                                                padding: "12px",
                                                marginBottom: "12px",
                                                background: quiz.isCorrect ? "#e6fffb" : "#fff1f0",
                                                border: `1px solid ${quiz.isCorrect ? "#b7eb8f" : "#ffa39e"}`,
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <Text strong>{`Q${qIdx + 1}. ${quiz.question}`}</Text>
                                            <div style={{ marginTop: "8px" }}>
                                                <Text type={quiz?.isCorrect ? "success" : "danger"}>
                                                    ✅ Correct Answer: {quiz?.options[quiz?.correctAnswer - 1]}
                                                </Text>
                                            </div>
                                            <div>
                                                <Text type={quiz.isCorrect ? "success" : "danger"}>
                                                    📝 Your Answer: {quiz?.options[quiz?.selectedAnswer - 1]}
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </Panel>
                            ))}
                        </Collapse>
                    </Card>
                </TabPane>
            </Tabs>
        </Card>
    );
};

const QuizDetailsModal = ({ visible, onClose, details }) => {
    return (
        <Modal open={visible} onCancel={onClose} footer={null} title="📋 Quiz Details">
            <List
                itemLayout="vertical"
                dataSource={details}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <Title level={5}>{index + 1}. {item.question}</Title>
                        <List
                            dataSource={item.options}
                            renderItem={(opt, idx) => {
                                const isCorrect = idx + 1 === item.correct;
                                const isSelected = idx + 1 === item.selected;
                                let color = 'default';

                                if (isCorrect && isSelected) color = 'green';
                                else if (isSelected && !isCorrect) color = 'red';
                                else if (isCorrect) color = 'green';

                                return (
                                    <List.Item style={{ paddingLeft: '1rem' }}>
                                        <Tag color={color}>
                                            {String.fromCharCode(65 + idx)}. {opt}
                                            {isCorrect && ' ✅'}
                                            {isSelected && !isCorrect && ' ❌'}
                                        </Tag>
                                    </List.Item>
                                );
                            }}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};
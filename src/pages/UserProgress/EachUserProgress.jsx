import { Button, List, message, Modal, Tabs, Tag } from "antd";
import { use, useEffect, useState } from "react";
import request from "../../lib/api/request";
import { fetchProgress } from "../Course/SpeechRecognisation/speechHelper";
import { Card, Typography, Progress, Table, Collapse, Divider } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useLocation } from "react-router-dom";
import { fetchListeningProgress } from "../VoiceCourses/voiceCourseHelper";
import {
    BookOutlined,
    SoundOutlined,
    AudioOutlined,
    TrophyOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

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
    const [isMobile, setIsMobile] = useState(false);

    // Check for mobile view
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            const formattedScores = res.map(course => {
                const quizDetails = (course.quiz || []).map((q, idx) => {
                    const selectedAnswer = course.submittedAnswers?.[idx];
                    return {
                        ...q,
                        selectedAnswer,
                        isCorrect: selectedAnswer === q.correctAnswer
                    };
                });

                return {
                    ...course,
                    quizDetails
                };
            });

            setListeningScores(formattedScores);
     
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
        <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
            <Card className="shadow-lg">
                <QuizDetailsModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    details={activeQuizDetails}
                />

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    size={isMobile ? 'small' : 'default'}
                    tabPosition={isMobile ? 'top' : 'top'}
                >
                    {/* Courses Tab */}
                    <TabPane
                        tab={
                            <span className={isMobile ? 'text-xs' : ''}>
                                <BookOutlined /> {isMobile ? 'Courses' : ' Courses'}
                            </span>
                        }
                        key="courses"
                    >
                        <Card
                            title={
                                <Title level={isMobile ? 5 : 4} className="m-0 flex items-center gap-2">
                                    Course Progress
                                </Title>
                            }
                            bordered
                            className="shadow-sm"
                        >
                            <Collapse
                                accordion
                                size={isMobile ? 'small' : 'default'}
                                className="bg-gray-50"
                            >
                                {courseProgress.map((course, idx) => {
                                    const medalInfo = getMedalInfo(course.medal);
                                    return (
                                        <Panel
                                            header={
                                                <div className={`${isMobile ? 'flex flex-col gap-1' : 'flex items-center gap-3'}`}>
                                                    <span className={isMobile ? 'text-sm font-medium' : 'text-base'}>
                                                        {course.course.title}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <Tag color="blue" size={isMobile ? 'small' : 'default'}>
                                                            {course.completedSections.length}/{course.currentSection} sections
                                                        </Tag>
                                                        {course?.medal && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-lg">{medalInfo?.emoji}</span>
                                                                <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-600`}>
                                                                    {medalInfo?.label}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            }
                                            key={idx}
                                            className="mb-2"
                                        >
                                            <div className={isMobile ? 'overflow-x-auto' : ''}>
                                                <Table
                                                    dataSource={course.quizScores.map((q, i) => ({ ...q, key: i }))}
                                                    columns={courseColumns}
                                                    pagination={false}
                                                    size="small"
                                                    scroll={isMobile ? { x: 400 } : undefined}
                                                    className="bg-white rounded-lg"
                                                />
                                            </div>
                                        </Panel>
                                    );
                                })}
                            </Collapse>
                        </Card>
                    </TabPane>

                    {/* Speech Practice Tab */}
                    <TabPane
                        tab={
                            <span className={isMobile ? 'text-xs' : ''}>
                                <SoundOutlined /> {isMobile ? 'Speech' : 'Speech Practice'}
                            </span>
                        }
                        key="speech"
                    >
                        <Card
                            title={
                                <Title level={isMobile ? 5 : 4} className="m-0">
                                    Speech Practice
                                </Title>
                            }
                            bordered
                            className="shadow-sm"
                        >
                            {speechScores.length === 0 ? (
                                <div className="text-center py-8">
                                    <SoundOutlined className="text-4xl text-gray-400 mb-4" />
                                    <Text className="text-gray-500">No speech scores available</Text>
                                </div>
                            ) : (
                                <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
                                    {speechScores.map((s, idx) => (
                                        <Card
                                            key={idx}
                                            type="inner"
                                            title={
                                                <div className={`${isMobile ? 'flex flex-col gap-1' : 'flex justify-between items-center'}`}>
                                                    <Tag
                                                        color={s.score >= 90 ? 'green' : s.score >= 70 ? 'orange' : 'red'}
                                                        className="text-sm font-semibold"
                                                    >
                                                        Score: {s.score}%
                                                    </Tag>
                                                    <Text className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                                                        {new Date(s.createdAt).toLocaleString()}
                                                    </Text>
                                                </div>
                                            }
                                            className="shadow-sm hover:shadow-md transition-shadow"
                                            size={isMobile ? 'small' : 'default'}
                                        >
                                            <div className="space-y-3">
                                                <div>
                                                    <Text strong className="text-green-600">✓ Expected:</Text>
                                                    <p className={`${isMobile ? 'text-sm' : ''} text-gray-600 mt-1 italic`}>
                                                        "{s.expectedText}"
                                                    </p>
                                                </div>

                                                <div>
                                                    <Text strong className="text-blue-600">🎤 Spoken:</Text>
                                                    <p className={`${isMobile ? 'text-sm' : ''} mt-1`}>
                                                        "{s.spokenText}"
                                                    </p>
                                                </div>

                                                <Divider className="my-3" />

                                                <div>
                                                    <Text className={`${isMobile ? 'text-sm' : ''} text-gray-600 mb-2 block`}>
                                                        Word Accuracy:
                                                    </Text>
                                                    <Progress
                                                        percent={Math.round((s.correctWords / s.totalWords) * 100)}
                                                        format={() => `${s.correctWords}/${s.totalWords} words correct`}
                                                        strokeColor={{
                                                            '0%': '#108ee9',
                                                            '100%': '#87d068',
                                                        }}
                                                        size={isMobile ? 'small' : 'default'}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </TabPane>

                    {/* Listening Practice Tab */}
                    <TabPane
                        tab={
                            <span className={isMobile ? 'text-xs' : ''}>
                                <AudioOutlined /> {isMobile ? 'Listening' : ' Listening Practice'}
                            </span>
                        }
                        key="listening"
                    >
                        <Card
                            title={
                                <Title level={isMobile ? 5 : 4} className="m-0">
                                    🎧 Listening Practice
                                </Title>
                            }
                            bordered
                            className="shadow-sm"
                        >
                            <Collapse
                                accordion
                                size={isMobile ? 'small' : 'default'}
                                className="bg-gray-50"
                            >
                                {listeningScores?.map((course, idx) => (
                                    <Panel
                                        header={
                                            <div className={`${isMobile ? 'flex flex-col gap-1' : 'flex justify-between items-center'}`}>
                                                <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                                                    {course?.courseTitle || 'Untitled Course'}
                                                </span>
                                                <Tag
                                                    color={course.score >= 90 ? 'green' : course.score >= 70 ? 'orange' : 'red'}
                                                    size={isMobile ? 'small' : 'default'}
                                                >
                                                    Score: {course?.score}%
                                                </Tag>
                                            </div>
                                        }
                                        key={idx}
                                        className="mb-2"
                                    >
                                        <div className="space-y-3">
                                            {Array.isArray(course?.quizDetails) && course.quizDetails.map((quiz, qIdx) => (
                                                <div
                                                    key={qIdx}
                                                    className={`
                            ${isMobile ? 'p-3' : 'p-4'} rounded-lg border-l-4 transition-all hover:shadow-sm
                            ${quiz.isCorrect
                                                            ? 'bg-green-50 border-l-green-400 border border-green-200'
                                                            : 'bg-red-50 border-l-red-400 border border-red-200'
                                                        }
                          `}
                                                >
                                                    <div className="flex items-start gap-2 mb-3">
                                                        {quiz.isCorrect ?
                                                            <CheckCircleOutlined className="text-green-500 text-lg mt-0.5" /> :
                                                            <CloseCircleOutlined className="text-red-500 text-lg mt-0.5" />
                                                        }
                                                        <Text strong className={`${isMobile ? 'text-sm' : ''}`}>
                                                            Q{qIdx + 1}. {quiz.question}
                                                        </Text>
                                                    </div>

                                                    <div className={`${isMobile ? 'space-y-2' : 'space-y-2'} ml-6`}>
                                                        <div className="flex items-center gap-2">
                                                            <Tag color="green" size="small">Correct</Tag>
                                                            <Text className={`${isMobile ? 'text-sm' : ''}`}>
                                                                {quiz?.options[quiz?.correctAnswer - 1]}
                                                            </Text>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <Tag color={quiz.isCorrect ? "green" : "red"} size="small">
                                                                Your Answer
                                                            </Tag>
                                                            <Text className={`${isMobile ? 'text-sm' : ''}`}>
                                                                {quiz?.options[quiz?.selectedAnswer - 1]}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Panel>
                                ))}
                            </Collapse>
                        </Card>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
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
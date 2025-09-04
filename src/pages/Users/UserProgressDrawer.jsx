import React from "react";
import {
  Drawer,
  Descriptions,
  Tabs,
  Table,
  Tag,
  Divider,
  Empty,
  Statistic,
  Row,
  Col,
  Progress,
  Card,
} from "antd";
import { FileTextOutlined, SoundOutlined, AudioOutlined } from "@ant-design/icons";
import { motion } from "framer-motion"; // For animation

const { TabPane } = Tabs;

export default function UserProgressDrawer({
  open,
  onClose,
  userData,
  listeningProgress,
  speechProgress,
}) {
  if (!userData) return null;

  const { user, courseProgress = [] } = userData;

  const allQuizScores = courseProgress.flatMap((course) => course?.quizScores || []);
  const totalQuizAttempts = allQuizScores.length;
  const avgQuizScore = totalQuizAttempts
    ? (allQuizScores.reduce((acc, cur) => acc + cur.score, 0) / totalQuizAttempts).toFixed(2)
    : 0;

  const totalListening = listeningProgress.length;
  const avgListeningScore = totalListening
    ? (listeningProgress.reduce((acc, cur) => acc + cur.score, 0) / totalListening).toFixed(2)
    : 0;

  const totalSpeech = speechProgress.length;
  const avgSpeechScore = totalSpeech
    ? (speechProgress.reduce((acc, cur) => acc + cur.score, 0) / totalSpeech).toFixed(2)
    : 0;

  return (
    <Drawer
      title={`Progress Overview: ${user?.name}`}
      placement="right"
      onClose={onClose}
      open={open}
      width={800}
    >
      {/* USER INFO */}
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* TOP METRICS */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Quiz Attempts" value={totalQuizAttempts} prefix={<FileTextOutlined />} />
            <Progress percent={parseFloat(avgQuizScore)} status="active" strokeColor="#1890ff" />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic title="Listening Practices" value={totalListening} prefix={<AudioOutlined />} />
            <Progress percent={parseFloat(avgListeningScore)} strokeColor="#52c41a" />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic title="Speech Practices" value={totalSpeech} prefix={<SoundOutlined />} />
            <Progress percent={parseFloat(avgSpeechScore)} strokeColor="#faad14" />
          </Card>
        </Col>
      </Row>

      {/* === TABS === */}
      <Tabs defaultActiveKey="1" animated={true}>
        {/* === COURSE PROGRESS === */}
        <TabPane
          tab={<span>📘 Course Progress</span>}
          key="1"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {courseProgress.length === 0 ? (
              <Empty description="No course progress" />
            ) : (
              <Row gutter={[16, 16]}>
                {courseProgress.map((course, index) => {
                  const courseTitle = course?.course?.title || "Untitled Course";
                  const totalSections = course?.course?.sections?.length || 1;
                  const completed = course?.completedSections?.length || 0;
                  const progressPercent = Math.round((completed / totalSections) * 100);

                  return (
                    <Col span={24} key={index}>
                      <Card bordered hoverable>
                        {/* Add course title and total sections */}
                        <h3 style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px" }}>
                          Title - {courseTitle} <Tag color="blue">Total Sections: {totalSections}</Tag>
                        </h3>


                        <Row justify="space-between" align="middle">
                          <Col>
                            <p><strong>Current Section:</strong> {course?.currentSection}</p>
                            <p><strong>Completed Sections:</strong> {completed} / {totalSections}</p>
                          </Col>
                          <Col>
                            <Progress type="circle" percent={progressPercent} width={80} />
                          </Col>
                        </Row>

                        <Divider orientation="left">Quiz Scores</Divider>
                        {course?.quizScores?.length > 0 ? (
                          <Table
                            columns={[
                              { title: 'Section', dataIndex: 'sectionIndex', key: 'sectionIndex' },
                              { title: 'Score', dataIndex: 'score', key: 'score' },
                              { title: 'Correct', dataIndex: 'correctAnswers', key: 'correctAnswers' },
                              { title: 'Total', dataIndex: 'totalQuestions', key: 'totalQuestions' },
                              {
                                title: 'Attempted At',
                                dataIndex: 'attemptedAt',
                                key: 'attemptedAt',
                                render: (val) => new Date(val).toLocaleString(),
                              },
                            ]}
                            dataSource={course.quizScores}
                            rowKey={(record, i) => `quiz-${i}`}
                            pagination={false}
                            size="small"
                          />
                        ) : (
                          <Tag color="orange">No quiz attempts</Tag>
                        )}
                      </Card>
                    </Col>
                  );
                })}
              </Row>

            )}
          </motion.div>
        </TabPane>

        {/* === LISTENING PRACTICE === */}
        <TabPane
          tab={<span>📢 Listening</span>}
          key="2"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {listeningProgress.length > 0 ? (
              <Row gutter={[16, 16]}>
                {listeningProgress.map((item, index) => (
                  <Col span={12} key={index}>
                    <Card hoverable size="small" title={item.courseTitle}>
                      <p><strong>Score:</strong> {item.score}</p>
                      <p><strong>Total Questions:</strong> {item.totalQuestions}</p>
                      <p><strong>Completed At:</strong> {new Date(item.completedAt).toLocaleString()}</p>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Tag color="orange">No listening attempts</Tag>
            )}
          </motion.div>
        </TabPane>

        {/* === SPEECH PRACTICE === */}
        <TabPane
          tab={<span>🗣️ Speech</span>}
          key="3"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {speechProgress.length > 0 ? (
              <Row gutter={[16, 16]}>
                {speechProgress.map((item, index) => (
                  <Col span={12} key={index}>
                    <Card hoverable size="small" title={`Speech ${index + 1}`}>
                      <p><strong>Expected:</strong> {item.expectedText}</p>
                      <p><strong>Spoken:</strong> {item.spokenText}</p>
                      <p><strong>Score:</strong> {item.score}</p>
                      <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Tag color="orange">No speech attempts</Tag>
            )}
          </motion.div>
        </TabPane>
      </Tabs>
    </Drawer>
  );
}

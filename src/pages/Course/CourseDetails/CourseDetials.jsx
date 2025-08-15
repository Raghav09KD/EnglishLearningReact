import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseSection,
  getCourseSectionDetails,
  updateCourseProgress,
  getCourseById
} from "../coursesHelper";
import toast from "react-hot-toast";

import {
  Layout,
  Menu,
  Typography,
  Button,
  Card,
  Tag,
  Divider,
  Modal,
  Radio,
  message,
  Progress
} from "antd";
import {
  CheckCircleTwoTone,
  LockOutlined,
  RightOutlined
} from "@ant-design/icons";
import { paths } from "../../../lib/path";
import CommentSection from "../../../components/CommentSection/CommentSection";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function AdminCourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [allSections, setAllSections] = useState([]);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [quizResults, setQuizResults] = useState(null);
  const [selectedSectionDetails, setSelectedSectionDetails] = useState(null);

  const isLastSection = selectedSectionIndex === allSections?.length - 1;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [sectionsRes, courseRes] = await Promise.all([
          getCourseSection(id),
          getCourseById(id)
        ]);

        const sectionsWithOverview = [
          {
            title: "Overview",
            isAccessible: true,
            isCompleted: false,
            isOverview: true
          },
          ...sectionsRes.sections
        ];

        setAllSections(sectionsWithOverview);
        setCourseDetails(courseRes);

        const firstAccessibleIndex = sectionsWithOverview.findIndex(
          (s) => s.isAccessible
        );
        setSelectedSectionIndex(
          firstAccessibleIndex !== -1 ? firstAccessibleIndex : 0
        );
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchSectionDetails = async () => {
      const currentSection = allSections[selectedSectionIndex];
      if (!currentSection || currentSection.isOverview) {
        setSelectedSectionDetails(null);
        return;
      }

      try {
        const sectionDetails = await getCourseSectionDetails(
          id,
          selectedSectionIndex - 1 // offset because overview is at index 0
        );
        setSelectedSectionDetails(sectionDetails);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchSectionDetails();
  }, [selectedSectionIndex, allSections]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const openQuizModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnswers({});
    setQuizResults(null);
  };

  const onSelectAnswer = (qIdx, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: value
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const reqBody = {
        courseId: id,
        sectionIndex: selectedSectionIndex - 1,
        ...(selectedSectionDetails?.quiz?.length > 0 && {
          answers: Object.values(selectedAnswers)
        })
      };
      const res = await updateCourseProgress(reqBody);
      setQuizResults(res.quizResults);

      const sectionres = await getCourseSection(id);
      setAllSections((prev) => [
        prev[0], // keep overview
        ...sectionres.sections
      ]);
      toast.success("Progress saved! Review your answers.");
    } catch (error) {
      toast.error("Error saving progress");
    }
  };

  // Calculate course progress excluding Overview
  const completedSections = allSections.slice(1).filter((s) => s.isCompleted).length;
  const totalSections = allSections.length > 1 ? allSections.length - 1 : 0;
  const progressPercent = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className="flex h-screen">
      {/* Quiz modal */}
      <Modal
        title="Quiz"
        open={isModalOpen}
        onOk={quizResults ? closeModal : handleSubmitQuiz}
        onCancel={closeModal}
        okText={quizResults ? "Close" : "Submit Quiz"}
        cancelText="Cancel"
      >
        {selectedSectionDetails?.quiz?.map((quiz, qIdx) => {
          const isReviewed = !!quizResults;
          const userAnswer = quizResults?.[qIdx]?.selected - 1;
          const correctAnswer = quizResults?.[qIdx]?.correct - 1;

          return (
            <div key={qIdx} className="mb-6">
              <p className="font-medium mb-2">
                Q{qIdx + 1}: {quiz.question}
              </p>

              <div className="flex flex-col gap-2">
                {isReviewed &&
                  quiz.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === correctAnswer;
                    const isUserWrong =
                      oIdx === userAnswer && userAnswer !== correctAnswer;

                    let optionStyle =
                      "bg-gray-100 border border-gray-300";
                    if (isCorrect)
                      optionStyle =
                        "bg-green-100 border border-green-400 text-green-700 font-semibold";
                    if (isUserWrong)
                      optionStyle =
                        "bg-red-100 border border-red-400 text-red-700 font-semibold";

                    return (
                      <div
                        key={oIdx}
                        className={`px-4 py-2 rounded ${optionStyle}`}
                      >
                        {opt}
                        {isCorrect && (
                          <span className="ml-2 text-sm text-green-700 font-medium">
                            ✅ Correct
                          </span>
                        )}
                        {isUserWrong && (
                          <span className="ml-2 text-sm text-red-700 font-medium">
                            ❌ Your Answer
                          </span>
                        )}
                      </div>
                    );
                  })}

                {!isReviewed && (
                  <Radio.Group
                    onChange={(e) =>
                      onSelectAnswer(qIdx, e.target.value)
                    }
                    value={selectedAnswers[qIdx]}
                    className="flex flex-col mt-2"
                  >
                    {quiz.options.map((opt, oIdx) => (
                      <Radio key={oIdx} value={oIdx}>
                        {opt}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
              </div>
            </div>
          );
        })}
      </Modal>

      <Layout style={{ height: "auto" }}>
        {/* Sidebar */}
        <Sider width={260} theme="light" className="shadow-sm" style={{
          position: "fixed",
          left: 0,
          height: "100vh",
          overflowY: "auto",
          background: "#fff",
          zIndex: 10,
        }} >
          <div className="p-4 border-b">
            <Title level={4}>Sections</Title>
          </div>

          <Menu mode="inline" selectedKeys={[`${selectedSectionIndex}`]}>
            {allSections?.map((s, i) => (
              <Menu.Item
                key={i}
                onClick={() => {
                  if (s.isAccessible) setSelectedSectionIndex(i);
                  else message.info("Complete previous section to unlock.");
                }}
                disabled={!s.isAccessible}
                icon={
                  s.isOverview
                    ? null
                    : s.isCompleted
                      ? <CheckCircleTwoTone twoToneColor="#52c41a" />
                      : !s.isAccessible
                        ? <LockOutlined />
                        : null
                }
              >
                {s.isOverview ? s.title : `${i}. ${s.title || "Untitled"}`}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        {/* Main Content */}
        <Layout style={{ marginLeft: 260, background: "#f5f5f5" }}>
          <Content className="p-8 max-w-4xl " style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
            {allSections[selectedSectionIndex]?.isOverview ? (
              <>
                <Title level={2}>{courseDetails?.title}</Title>
                <Paragraph>{courseDetails?.description}</Paragraph>
                <Tag color="blue" style={{ textTransform: "capitalize" }}>
                  Level: {courseDetails?.level}
                </Tag>

                {/* Progress Bar */}
                <div style={{ marginTop: 24 }}>
                  <Text strong>{completedSections} of {totalSections} sections completed</Text>
                  <Progress
                    percent={progressPercent}
                    status="active"
                    strokeColor={{
                      from: "#108ee9",
                      to: "#87d068",
                    }}
                    style={{ marginTop: 8 }}
                  />
                </div>

                {/* NEXT BUTTON for Overview */}
                <div style={{ marginTop: "3rem", textAlign: "left" }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      const firstSectionIndex = allSections.findIndex(
                        (s, i) => i > 0 && s.isAccessible
                      );
                      if (firstSectionIndex !== -1) {
                        setSelectedSectionIndex(firstSectionIndex);
                      }
                    }}
                    icon={<RightOutlined />}
                  >
                    Start Course
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <Text style={{ fontSize: "1.5rem", color: "rgba(0, 0, 0, 0.77)", display: "block" }}>
                    Section {selectedSectionIndex}
                  </Text>
                  <Title level={3} style={{ marginTop: "0.5rem" }}>
                    {allSections[selectedSectionIndex]?.title}
                  </Title>
                </div>

                <Card className="mb-4" bordered={false}>
                  <Paragraph>{selectedSectionDetails?.content}</Paragraph>
                </Card>

                {selectedSectionDetails?.mediaUrl && (
                  <Card className="mb-4" type="inner" title="Media">
                    {/\.(jpg|jpeg|png|gif|webp)$/i.test(selectedSectionDetails.mediaUrl) ? (
                      // Image display
                      <img
                        src={selectedSectionDetails.mediaUrl}
                        alt="Section Media"
                        style={{
                          maxWidth: "100%",
                          borderRadius: "8px",
                          marginTop: "0.5rem"
                        }}
                      />
                    ) : /\.(mp4|webm|ogg)$/i.test(selectedSectionDetails.mediaUrl) ? (
                      // Video file player
                      <video
                        src={selectedSectionDetails.mediaUrl}
                        controls
                        style={{
                          maxWidth: "100%",
                          borderRadius: "8px",
                          marginTop: "0.5rem"
                        }}
                      />
                    ) : /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/.test(
                      selectedSectionDetails.mediaUrl
                    ) ? (
                      // YouTube video embed
                      <iframe
                        width="100%"
                        height="530"
                        style={{ borderRadius: "8px", marginTop: "0.5rem" }}
                        src={`https://www.youtube.com/embed/${selectedSectionDetails.mediaUrl.match(
                          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
                        )[1]
                          }`}
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      // Default "View Media" link
                      <a
                        href={selectedSectionDetails.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Text type="secondary" underline>
                          View Media
                        </Text>
                      </a>
                    )}
                  </Card>
                )}



                {selectedSectionDetails?.speechPracticeText && (
                  <Card className="mb-4 bg-gray-50 border">
                    <Text italic>
                      <strong>Speech Practice: </strong>
                      {selectedSectionDetails.speechPracticeText}
                    </Text>
                  </Card>
                )}

                {/* New Next section intro text */}
                <div style={{ marginTop: "2rem" }}>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Next</div>
                  <div style={{ marginTop: "0.5rem", color: "rgba(0,0,0,0.75)" }}>
                    So, how was that for a{" "}
                    {allSections[selectedSectionIndex]?.title} introduction? Now it's time to
                    practise. Test your knowledge with quizzes, in the next activity.
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-4">
                    {!allSections?.[selectedSectionIndex]?.isCompleted &&
                      selectedSectionDetails?.quiz?.length > 0 && (
                        <Button type="primary" onClick={openQuizModal}>
                          Take Quiz
                        </Button>
                      )}

                    {allSections?.[selectedSectionIndex]?.isCompleted && (
                      <Button
                        type="primary"
                        onClick={() => {
                          if (isLastSection) {
                            navigate(paths.COURSES);
                          } else {
                            setSelectedSectionIndex(selectedSectionIndex + 1);
                          }
                        }}
                        icon={<RightOutlined />}
                      >
                        {isLastSection ? "Finish" : "Next"}
                      </Button>
                    )}

                    {!selectedSectionDetails?.quiz?.length &&
                      !allSections?.[selectedSectionIndex]?.isCompleted && (
                        <Button
                          type="primary"
                          onClick={handleSubmitQuiz}
                        >
                          Mark as Complete & Continue
                        </Button>
                      )}
                  </div>
                </div>
              </>
            )}

            <Divider className="mt-10" />
            {allSections?.[allSections?.length - 1]?.isCompleted === true && (
              <CommentSection courseId={id} canComment={true} />
            )}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

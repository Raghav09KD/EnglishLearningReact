import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Radio } from "antd";
import { getCourseById, getCourseSection, getCourseSectionDetails, updateCourseProgress } from "../coursesHelper";
import toast from "react-hot-toast";
import { paths } from "../../../lib/path";

export default function AdminCourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [allSections, setAllSections] = useState([]);
  console.log("🚀 ~ AdminCourseDetails ~ allSections:", allSections)
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  console.log("🚀 ~ AdminCourseDetails ~ selectedSectionIndex:", selectedSectionIndex)
  const [quizResults, setQuizResults] = useState(null);
  const [selectedSectionDetails, setSelectedSectionDetails] = useState(null);


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseSection(id);
        setAllSections(res.sections);
        const firstAccessibleIndex = res.data.sections.findIndex(s => s.isAccessible);
        setSelectedSectionIndex(firstAccessibleIndex !== -1 ? firstAccessibleIndex : 0);


        // const data = await getCourseById(id);
        // setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchSectionDetails = async () => {
      if (selectedSectionIndex >= 0) {
        try {
          const sectionDetails = await getCourseSectionDetails(id, selectedSectionIndex);
          setSelectedSectionDetails(sectionDetails);

        } catch (error) {
          toast.error(error)
        }
      }
    }
    fetchSectionDetails();
  }, [selectedSectionIndex]);
  // if (!course) return <p className="p-6">Loading...</p>;

  const section = course?.sections[selectedSectionIndex];




  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  // Open quiz modal
  const openQuizModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setQuizResults(null);
  };

  const onSelectAnswer = (qIdx, value) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: value,
    }));
  };

  // Submit handler
  const handleSubmitQuiz = async () => {
    try {
      console.log("Selected:", Object.values(selectedAnswers));
      const reqBody = {
        courseId: id,
        sectionIndex: selectedSectionIndex,
        ...(selectedSectionDetails?.quiz?.length > 0 && {
          answers: Object.values(selectedAnswers),
        }),
      }
      console.log("🚀 ~ handleSubmitQuiz ~ reqBody:", reqBody)
      const res = await updateCourseProgress(reqBody);
      setQuizResults(res.quizResults);


      const sectionres = await getCourseSection(id);
      setAllSections(sectionres.sections);
      const firstAccessibleIndex = res.data.sections.findIndex(s => s.isAccessible);
      setSelectedSectionIndex(firstAccessibleIndex !== -1 ? firstAccessibleIndex : 0);


      // closeModal();
      // setIsCompleted(true);
      toast.success("Progress saved! Review your answers.");
    } catch (error) {
      // toast.error(error)
    }
    // Validate or send to backend


  };

  return (
    <div className="flex h-screen">

      {/* quizz modal */}
      <Modal
        title="Quiz"
        open={isModalOpen}
        onOk={quizResults ? closeModal : handleSubmitQuiz}
        onCancel={closeModal}
        okText={quizResults ? "Close" : "Submit Quiz"}
        cancelText="Cancel"
      // okButtonProps={{ disabled: quizResults }}
      >
        {selectedSectionDetails?.quiz?.map((quiz, qIdx) => {
          const isReviewed = !!quizResults;
          console.log("isReviewed", isReviewed)
          const userAnswer = quizResults?.[qIdx]?.selected - 1 ;
          const correctAnswer = quizResults?.[qIdx]?.correct - 1;

          return (
            <div key={qIdx} className="mb-6">
              <p className="font-medium mb-2">
                Q{qIdx + 1}: {quiz.question}
              </p>

              <div className="flex flex-col gap-2">
                {isReviewed && quiz.options.map((opt, oIdx) => {
                  const isCorrect = isReviewed && oIdx === correctAnswer;
                  const isUserWrong = isReviewed && oIdx === userAnswer && userAnswer !== correctAnswer;

                  let optionStyle = "bg-gray-100 border border-gray-300";
                  if (isCorrect) optionStyle = "bg-green-100 border border-green-400 text-green-700 font-semibold";
                  if (isUserWrong) optionStyle = "bg-red-100 border border-red-400 text-red-700 font-semibold";

                  return (
                    <div
                      key={oIdx}
                      className={`px-4 py-2 rounded ${optionStyle}`}
                    >
                      {opt}
                      {isReviewed && oIdx === correctAnswer && (
                        <span className="ml-2 text-sm text-green-700 font-medium">✅ Correct</span>
                      )}
                      {isUserWrong && (
                        <span className="ml-2 text-sm text-red-700 font-medium">❌ Your Answer</span>
                      )}
                    </div>
                  );
                })}

                {!isReviewed && (
                  <Radio.Group
                    onChange={(e) => onSelectAnswer(qIdx, e.target.value)}
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

      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Sections</h2>
        {allSections?.length > 0 && allSections?.map((s, i) => (
          <div
            key={i}
            onClick={() => {
              if (s.isAccessible) setSelectedSectionIndex(i);
            }}
            className={`cursor-pointer p-2 rounded mb-2 flex justify-between items-center
      ${selectedSectionIndex === i ? "bg-blue-600 text-white" : ""}
      ${!s.isAccessible ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}
    `}
          >
            <span>
              {i + 1}. {s.title || "Untitled"}
            </span>

            {s?.isCompleted && (
              <span className="text-green-600 font-bold text-sm">✓</span>
            )}
          </div>
        ))}
      </aside>

      <main className="flex-1 p-8 overflow-y-auto max-w-3xl mx-auto">
        {/* Section Header */}
        <h1 className="text-3xl font-bold mb-4">{section?.title}</h1>

        {/* Content */}
        <div className="prose prose-lg text-gray-800 mb-6">
          <p>{selectedSectionDetails?.content}</p>
        </div>

        {/* Media Link */}
        {selectedSectionDetails?.mediaUrl && (
          <div className="mb-4">
            <span className="text-sm text-gray-600">Media Link: </span>
            <a
              href={section?.mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View Media
            </a>
          </div>
        )}

        {/* Speech Practice */}
        {selectedSectionDetails?.speechPracticeText && (
          <div className="bg-gray-50 border p-4 rounded mb-6">
            <p className="text-gray-700 italic">
              <strong>Speech Practice:</strong> {section?.speechPracticeText}
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {/* Case 1: Quiz available and section not completed */}
          {!allSections?.[selectedSectionIndex]?.isCompleted &&
            selectedSectionDetails?.quiz?.length > 0 && (
              <Button type="primary" onClick={openQuizModal}>
                Take Quiz
              </Button>
            )}

          {/* Case 2: Section is completed */}
          {allSections?.[selectedSectionIndex]?.isCompleted && (
            <Button
              type="primary"
              onClick={() => {
                const isLastSection = selectedSectionIndex === allSections.length - 1;
                if (isLastSection) {
                  navigate(paths.COURSES); // change path as per your route
                } else {
                  setSelectedSectionIndex(selectedSectionIndex + 1);
                }
              }}
            >
              {selectedSectionIndex === allSections.length - 1 ? "Finish" : "Next"}
            </Button>
          )}

          {/* Case 3: No quiz and not completed */}
          {!selectedSectionDetails?.quiz?.length &&
            !allSections?.[selectedSectionIndex]?.isCompleted && (
              <button
                onClick={handleSubmitQuiz}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Mark as Complete & Continue
              </button>
            )}
        </div>
      </main>
    </div>
  );
}




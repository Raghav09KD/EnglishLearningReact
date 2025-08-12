import React, { useEffect, useState, useRef } from "react";
import { Card, Button, Spin, message, Modal, Radio } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getAllListeningCourseDetails, updateProgress } from "./voiceCourseHelper";

const VoiceCoursePlayer = () => {

    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [quizUnlocked, setQuizUnlocked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const [quizResults, setQuizResults] = useState(null);

    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const { id } = useParams();

    // Fetch courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getAllListeningCourseDetails(id);
                setSelectedCourse(res);
            } catch (err) {
                console.error(err);
                message.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        // ✅ Create source only once
        let sourceNode;
        try {
            sourceNode = audioCtx.createMediaElementSource(audioRef.current);
        } catch (err) {
            console.warn("MediaElementSource already created, reusing existing one.");
        }

        if (sourceNode) {
            sourceNode.connect(analyser);
            analyser.connect(audioCtx.destination);
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#001529";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;
                ctx.fillStyle = `rgb(${barHeight + 100}, 200, 255)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();

        // ✅ Cleanup
        return () => {
            cancelAnimationFrame(animationRef.current);
            analyser.disconnect();
            sourceNode && sourceNode.disconnect();
            audioCtx.close();
        };
    }, [selectedCourse]);


    const handlePlay = (course) => {
        setSelectedCourse(course);
        setQuizUnlocked(false);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
            }
        }, 300);
    };

    const handleAudioEnd = () => {
        message.success("You can now take the quiz!");
        setQuizUnlocked(true);
    };

    const onSelectAnswer = (qIdx, value) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [qIdx]: value,
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAnswers({});
        setQuizResults(null);
    };

    const handleSubmitQuiz = async () => {
        // const results = await submitQuiz(selectedAnswers);
        // setQuizResults(results);
        try {
             const reqBody = {
            id: id,
            submitedAnswers: selectedAnswers
        }
        const res = await updateProgress(reqBody);
        console.log("Submitting quiz with answers:", res);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
       
    };

    if (loading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;

    return (
        <div style={{ maxWidth: 800, margin: "auto" }}>

            <Modal
                title="Quiz"
                open={isModalOpen}
                onOk={quizResults ? closeModal : handleSubmitQuiz}
                onCancel={closeModal}
                okText={quizResults ? "Close" : "Submit Quiz"}
                cancelText="Cancel"
            // okButtonProps={{ disabled: quizResults }}
            >
                {selectedCourse?.quiz?.map((quiz, qIdx) => {
                    const isReviewed = !!quizResults;
                    console.log("isReviewed", isReviewed)
                    const userAnswer = quizResults?.[qIdx]?.selected - 1;
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

            <Card
                title={selectedCourse.title}
                extra={<Button onClick={() => setSelectedCourse(null)}>Back</Button>}
            >
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={150}
                    style={{ width: "100%", background: "#001529", borderRadius: "8px", marginBottom: "16px" }}
                />
                <audio
                    ref={audioRef}
                    controls
                    style={{ width: "100%" }}
                    onEnded={handleAudioEnd}
                >
                    <source src={selectedCourse.mp3File} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                <div style={{ marginTop: 20 }}>
                    <Button type="primary" disabled={!quizUnlocked} onClick={() => setIsModalOpen(true)}>
                        Start Quiz
                    </Button>
                </div>
            </Card>

        </div>
    );
};

export default VoiceCoursePlayer;

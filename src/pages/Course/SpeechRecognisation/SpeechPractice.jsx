
import { useEffect, useState } from "react";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { scoreSpeechApi } from "./speechHelper";
import { Button, Progress, Alert, Card, Typography, Space } from 'antd';
import {
  PlayCircleOutlined,
  StopOutlined,
  SoundOutlined,
  CheckCircleOutlined,
  AudioOutlined,
  MicrophoneIcon
} from '@ant-design/icons';

const { Title, Text } = Typography;
export default function SpeechPractice() {
  const location = useLocation();
  const [userTranscript, setUserTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [ssString, setSsString] = useState('');

  const [feedbackText, setFeedBackText] = useState(null);

  const { text } = location.state || {};
  console.log("🚀 ~ SpeechPractice ~ para:", text)

  const { start, stop, isListening } = useSpeechRecognition((transcript) => {
    console.log("🚀 ~ SpeechPractice ~ transcript:", transcript)
    setUserTranscript(transcript);
  });

  const handleSubmit = async () => {
    if (!userTranscript) return alert("Please record your speech first.");

    setIsLoading(true);
    try {

      const res = await scoreSpeechApi({ id: text?.id, expectedText: text?.text, spokenText: userTranscript })
      setFeedBackText(res)
      setFeedback(res.data);
      setSsString(createString(text?.text, res?.result?.mistakes));
    } catch (err) {
      console.error(err);
      alert("Error evaluating speech.");
    } finally {
      setIsLoading(false);
    }
  };

  const createString = (text, mistakes) => {
    let mistakesCopy = mistakes?.map((w) => w?.toLowerCase()) || [];

    const expectedWords = text
      ?.toLowerCase()
      ?.replace(/[^\w\s]/g, "")
      .split(/\s+/)
      ?.filter(Boolean);

    let returnString = "";

    for (let word of expectedWords) {
      const cleanWord = word?.toLowerCase();
      const baseClasses =
        "inline-flex items-center gap-1 px-2 py-1 m-1 rounded-lg shadow-sm cursor-pointer transition-all duration-200";

      if (mistakesCopy.includes(cleanWord)) {
        returnString += `
        <span 
          class="${baseClasses} bg-red-100 text-red-800 hover:bg-red-200 hover:scale-105 group" 
          onclick="window.speakWord && window.speakWord('${cleanWord}')"
        >
          ${word}
          <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">🔊</span>
        </span>`;
        mistakesCopy = mistakesCopy.filter((w) => w !== cleanWord); // remove first match
      } else {
        returnString += `
        <span 
          class="${baseClasses} bg-green-100 text-green-800 hover:bg-green-200 hover:scale-105 group" 
          onclick="window.speakWord && window.speakWord('${cleanWord}')"
        >
          ${word}
          <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">🔊</span>
        </span>`;
      }
    }

    return returnString;
  };



  useEffect(() => {
    if (!text?.text || !feedback?.result?.mistakes) return;
    setSsString(createString(text?.text, feedback?.result?.mistakes));
  }, [text?.text, feedback?.result?.mistakes]);


  // Clone mistakes so we can modify it without affecting props
  const remainingMistakes = feedbackText?.result?.mistakes ? [...feedbackText?.result?.mistakes?.map((w) => w?.toLowerCase())] : [];

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return '#10b981';
    if (accuracy >= 75) return '#f59e0b';
    if (accuracy >= 60) return '#ef4444';
    return '#dc2626';
  };

  const getAccuracyGrade = (accuracy) => {
    if (accuracy >= 90) return 'Excellent';
    if (accuracy >= 75) return 'Good';
    if (accuracy >= 60) return 'Fair';
    return 'Needs Practice';
  };

  const speakWord = (word) => {
    if (!word) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US"; 
    speechSynthesis.speak(utterance);
  };

  const speakSentence = (sentence) => {
    if (!sentence) {
      console.log("❌ No sentence to play");
      return;
    }
    console.log("🔊 speakSentence called with:", sentence);

    try { window.speechSynthesis.cancel(); } catch { }
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };




  useEffect(() => {
    window.speakWord = speakWord;
    window.speakSentence = speakSentence;

    return () => {
      window.speakWord = null;
      window.speakSentence = null;
    };
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <SoundOutlined className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Pronunciation Practice</h1>
            <p className="text-blue-100 opacity-90">Perfect your English pronunciation with AI feedback</p>
          </div>

          <div className="p-8 space-y-8">

            {/* Practice Text Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                {text?.title}
              </h2>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-200/30 rounded-full -ml-8 -mb-8"></div>
                <p className="text-sm font-semibold text-blue-700 mb-3 uppercase tracking-wide">Practice Text</p>
                <p className="text-xl leading-relaxed text-gray-800 font-medium relative z-10">
                  {text?.text}
                </p>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={start}
                disabled={isListening}
                className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <PlayCircleOutlined className="text-xl" />
                Start Speaking
              </button>

              <button
                onClick={stop}
                disabled={!isListening}
                className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <StopOutlined className="text-xl" />
                Stop
              </button>
            </div>

            {/* Listening Indicator */}
            {isListening && (
              <div className="flex items-center justify-center gap-3 py-6">
                <div className="relative">
                  <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-6 h-6 bg-red-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-lg font-semibold text-red-600 animate-pulse">
                  🎤 Listening... Speak now!
                </span>
                <div className="flex space-x-1">
                  <div className="w-1 h-8 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-10 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-6 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            {/* User Transcript - Minimal Styling */}
            {userTranscript && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Your Speech:</p>
                <div className="bg-white border-l-4 border-l-blue-500 shadow-sm rounded-lg p-4">
                  <p className="text-lg text-gray-800 leading-relaxed">{userTranscript}</p>
                </div>
              </div>
            )}

            {/* Check Pronunciation Button */}
            {userTranscript && (
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <CheckCircleOutlined className="text-xl" />
                      Check Pronunciation
                    </>
                  )}
                </button>
              </div>
            )}
            {(feedbackText || feedback) && (
              <div className="text-center mt-2">
                <button
                  onClick={() => {
                    const sentence = Array.isArray(feedback?.expected)
                      ? feedback.expected.join(" ")
                      : feedback?.expected || text?.text; // fallback to practice text

                    console.log("▶️ Playing sentence:", sentence);
                    speakSentence(sentence);
                  }}
                  title="Play corrected sentence"
                  aria-label="Play corrected sentence"
                  className="inline-flex items-center gap-2 border border-blue-400/70 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-all duration-200"
                >
                  <SoundOutlined className="text-base" />
                  Play Sentence
                </button>

              </div>
            )}





            {/* Feedback Section */}
            {feedback && (
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg space-y-6">

                {/* Header */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleOutlined className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Pronunciation Results</h3>
                </div>

                {/* Accuracy Score */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm">
                    <div className="text-center">
                      <div
                        className="text-4xl font-bold mb-1"
                        style={{ color: getAccuracyColor(feedback.accuracy) }}
                      >
                        {feedback.accuracy}%
                      </div>
                      <div
                        className="text-sm font-semibold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: getAccuracyColor(feedback.accuracy) }}
                      >
                        {getAccuracyGrade(feedback.accuracy)}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${feedback.accuracy}%`,
                        backgroundColor: getAccuracyColor(feedback.accuracy)
                      }}
                    ></div>
                  </div>
                </div>

                {/* Feedback Message */}
                <div className="bg-blue-50 border-l-4 border-l-blue-400 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">💡</span>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Feedback</p>
                      <p className="text-blue-800">{feedback.message}</p>
                    </div>
                  </div>
                </div>

                {/* Comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-green-700 mb-2">✓ Expected</p>
                    <p className="text-sm text-green-800 italic">"{feedback.expected}"</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-blue-700 mb-2">🎤 You said</p>
                    <p className="text-sm text-blue-800 italic">"{feedback.spoken}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Feedback HTML */}
            {feedbackText && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: ssString }}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

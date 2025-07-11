import { useEffect, useState } from "react";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { scoreSpeechApi } from "./speechHelper";

const practiceText = "The quick brown fox jumps over the lazy dog.";

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
    // try {
    let mistakesCopy = mistakes;
    let idx = 0;

    const expectedWords = text?.toLowerCase()?.replace(/[^\w\s]/g, '').split(/\s+/)?.filter(Boolean);
    console.log("🚀 ~ createString ~ expectedWords:", expectedWords)

    let returnString = '';

    for (let word of expectedWords) {
      console.log()
      if (mistakesCopy?.[idx]?.toLowerCase() === word?.toLowerCase() && word) {
        returnString += `<span class="inline-block px-2 py-1 m-1 bg-red-100 text-red-800 rounded-lg shadow-sm">${word}</span>`;
        mistakesCopy[idx] = '';
        idx++;
      } else {
        returnString += `<span class="inline-block px-2 py-1 m-1 bg-green-100 text-green-800 rounded-lg shadow-sm">${word}</span>`;
      }
    }

    console.log("🚀 ~ createString ~ returnString:", returnString)
    return returnString;
    // } catch (error) {
    //   console.error("error", error);
    // }
  };

  useEffect(() => {
    setSsString(createString(text?.text, feedback?.result?.mistakes));
  }, [text?.text, feedback?.result?.mistakes]);


  // Clone mistakes so we can modify it without affecting props
  const remainingMistakes = feedbackText?.result?.mistakes ? [...feedbackText?.result?.mistakes?.map((w) => w?.toLowerCase())] : [];

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-6 rounded">
      <h2 className="text-xl font-bold mb-4">🗣️ Pronunciation Practice</h2>

      <h3 className="text-lg font-bold my-6">{text?.title}</h3>
      <p className="mb-4 text-gray-700">
        <strong>Practice Text:</strong> {text?.text}
      </p>

      <div className="flex gap-4 mb-4">
        <button
          onClick={start}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Start Speaking
        </button>
        <button
          onClick={stop}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Stop
        </button>
      </div>

      {userTranscript && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Your Transcript:</p>
          <p className="border px-3 py-2 rounded bg-gray-100">{userTranscript}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Evaluating..." : "Check Pronunciation"}
      </button>

      {isListening && <p>isListening</p>}

      {feedbackText && <div
        // className="leading-6 text-lg"
        dangerouslySetInnerHTML={{ __html: ssString }}
      />}

      {feedback && (
        <div className="mt-6 bg-gray-100 p-4 rounded border">
          <p className="font-semibold">Accuracy: {feedback.accuracy}%</p>
          <p className="text-gray-600">{feedback.message}</p>
          <p className="text-xs mt-2 text-gray-500">
            Expected: "{feedback.expected}" <br />
            You said: "{feedback.spoken}"
          </p>
        </div>
      )}
    </div>
  );
}

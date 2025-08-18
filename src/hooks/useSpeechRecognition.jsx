import { useEffect, useRef, useState } from "react";

export const useSpeechRecognition = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      console.log("Transcript event:", transcript);
      onResult(transcript);
    };

    recognition.onend = () => {
      if (isListening) {
        console.log("Restarting recognition…"); // ✅ debug
        setTimeout(() => recognition.start(), 200); // 👈 delay prevents Chrome bug
      }
    };

    recognition.onerror = (err) => {
      console.error("Recognition error:", err); // ✅ catch errors
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onResult, isListening]);

  const start = () => {
    if (recognitionRef.current && !isListening) {
      console.log("🎤 Start listening…");
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stop = () => {
    if (recognitionRef.current && isListening) {
      console.log("🛑 Stop listening…");
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return { start, stop, isListening };
};

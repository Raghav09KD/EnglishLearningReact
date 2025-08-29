import { useRef, useState, useEffect } from "react";

export const useSpeechRecognition = (onResult) => {
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const listeningActiveRef = useRef(false); // gate for results

  const createRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      if (!listeningActiveRef.current) {
        console.log("⚠️ Ignored stray result after stop");
        return; // 👈 don’t forward background junk
      }

      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      console.log("Transcript event:", transcript);
      onResult(transcript);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        console.log("Recognition aborted cleanly");
        return;
      }
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };

    return recognition;
  };

  const start = () => {
    if (!isListening) {
      console.log("🎤 Starting recognition...");
      const recognition = createRecognition();
      if (!recognition) return;
      recognitionRef.current = recognition;
      listeningActiveRef.current = true; // ✅ allow results
      recognition.start();
      setIsListening(true);
    }
  };

  const stop = () => {
    if (recognitionRef.current && isListening) {
      console.log("🛑 Stop listening…");
      recognitionRef.current.stop(); 
    // recognitionRef.current.onresult = null;
    // recognitionRef.current = null; 
      setIsListening(false);
    }
  };


  return { start, stop, isListening };
};

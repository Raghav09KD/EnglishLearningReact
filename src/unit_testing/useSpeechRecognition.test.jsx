import { renderHook, act } from "@testing-library/react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

describe("useSpeechRecognition", () => {
  let startMock, stopMock, recognition;

  beforeEach(() => {
    startMock = jest.fn();
    stopMock = jest.fn();
    recognition = {
      start: startMock,
      stop: stopMock,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    global.SpeechRecognition = jest.fn(() => recognition);
    global.webkitSpeechRecognition = global.SpeechRecognition;
  });

  it("starts recognition", () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(jest.fn())
    );
    act(() => result.current.start());
    expect(startMock).toHaveBeenCalled();
    expect(result.current.isListening).toBe(true);
  });

  it("stops recognition", () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(jest.fn())
    );
    act(() => result.current.start());
    act(() => result.current.stop());
    expect(stopMock).toHaveBeenCalled();
    expect(result.current.isListening).toBe(false);
  });
});

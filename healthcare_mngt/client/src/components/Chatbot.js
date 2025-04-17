import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../styles/Chatbot.css";
import ChatHistory from "./ChatHistory";
import Loading from "./Loading";
import { FaUserMd, FaUser, FaTimes, FaStethoscope } from "react-icons/fa";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAGwsBCk6e-pkNgwHsCTAwmGCHu_4DSRio"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const healthKeywords = [
    "fever",
    "cough",
    "cold",
    "flu",
    "headache",
    "pain",
    "infection",
    "medicine",
    "treatment",
    "symptoms",
    "disease",
    "doctor",
    "hospital",
    "surgery",
    "covid",
    "diabetes",
    "cancer",
    "heart",
    "blood pressure",
    "cholesterol",
    "virus",
    "vaccine",
    "injury",
    "therapy",
    "mental health",
    "anxiety",
    "depression",
    "nutrition",
    "diet",
    "weight loss",
    "nausea",
    "vomiting",
    "vomit",
    "diarrhea",
    "stomach ache",
    "migraine",
    "fatigue",
    "dizziness",
    "rash",
    "allergy",
    "infection",
    "cancer",
    "asthma",
    "pneumonia",
    "stroke",
    "hypertension",
  ];

  const isHealthRelated = (input) => {
    const lowerInput = input.toLowerCase();
    return healthKeywords.some((keyword) => lowerInput.includes(keyword));
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;
    setIsLoading(true);
    setShowWarning(false);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!isHealthRelated(userInput)) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          type: "user",
          message: userInput,
          icon: <FaUser />,
          time: timeString,
        },
        {
          type: "bot",
          message:
            "⚠️ I can only answer medical or health-related questions. Please ask about illnesses, symptoms, treatments, or healthcare topics.",
          icon: <FaUserMd />,
          time: timeString,
        },
      ]);
      setUserInput("");
      setIsLoading(false);
      return;
    }

    try {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          type: "user",
          message: userInput,
          icon: <FaUser />,
          time: timeString,
        },
      ]);

      const result = await model.generateContent(userInput);
      const response = await result.response;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          type: "bot",
          message: response.text(),
          icon: <FaUserMd />,
          time: timeString,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          type: "bot",
          message: "Sorry, I couldn't process your request. Please try again.",
          icon: <FaUserMd />,
          time: timeString,
        },
      ]);
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setShowWarning(true);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div>
      <button className="open-chatbot-btn" onClick={toggleChatbot}>
        💬
      </button>

      {isChatbotOpen && (
        <div className="chatbot-container">
          <FaTimes className="close-btn" onClick={toggleChatbot} />
          <div className="header">
            <img
              src="/assets/assistant-removebg-preview.png"
              alt="MediSwift Logo"
              className="hospital-logo"
            />
            <h1 className="hospital-name"> MediSwift</h1>
          </div>

          <div className="chat-wrapper">
            {showWarning && (
              <div className="warning-box">
                ⚠️ Please ask only medical and health-related questions.
              </div>
            )}

            <div className="chat-container">
              <h2 className="chat-subheading">
                You are chatting with Dr. Swift
              </h2>

              <div className="chat-messages">
                <ChatHistory chatHistory={chatHistory} />
                {isLoading && <Loading />}
              </div>

              <div className="input-container">
                <FaUser className="user-icon" />
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type your message..."
                  value={userInput}
                  onChange={handleUserInput}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="send-button"
                  onClick={sendMessage}
                  disabled={isLoading}
                >
                  Send
                </button>
              </div>

              <div className="clear-button-container">
                <button className="clear-button" onClick={clearChat}>
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

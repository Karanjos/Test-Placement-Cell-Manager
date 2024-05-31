import { useState, useRef, useEffect } from "react";
import ChatBot from "react-simple-chatbot"; //npm install react-simple-chatbot --save

const About = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const chatbotRef = useRef(null);
  const steps = [
    {
      id: "1",
      message: "hello, What is your name?",
      trigger: "2",
    },
    {
      id: "2",
      user: true,
      trigger: "3",
    },
    {
      id: "3",
      message: `Hi {previousValue} , nice to meet you!`,
      trigger: "4",
    },
    {
      id: "4",
      message: `what are ur queries !`,
      trigger: "5",
    },
    {
      id: "5",
      options: [
        {
          value: 1,
          label: "How can I contact the placement cell?",
          trigger: "6",
        },
        { value: 2, label: "Eligibility criteria", trigger: "7" },
        { value: 3, label: "Job opportunities", trigger: "8" },
        { value: 4, label: "problem regarding registration", trigger: "ab" },
      ],
    },
    {
      id: "ab",
      message: `You can contact Karan Joshi
      Email:karanjoshi@gmail.com`,
      trigger: "9",
    },

    {
      id: "6",
      message: `you can contact to your placement head akhilpatwal4
      @gmail.com`,
      trigger: "9",
    },
    {
      id: "7",
      message: `At least 60% in the 10th and 12th grades And CGPA more than 6 in the college`,
      trigger: "9",
    },
    {
      id: "8",
      message: ` check out the job section for better results`,
      trigger: "9",
    },
    {
      id: "9",
      message: `any further queries?`,
      trigger: "10",
    },
    {
      id: "10",
      user: true,
      validator: (value) => {
        if (value === "yes") {
          return true;
        }
        return "thank you for visiting!";
      },

      trigger: "5",
    },
  ];

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
    setChatVisible(!showChatbot);
  };

  const handleEndChat = () => {
    setChatVisible(false);
  };
  const handleOutsideClick = (e) => {
    if (chatbotRef.current && !chatbotRef.current.contains(e.target)) {
      setChatVisible(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className=" min-h-screen relative">
      <div className="absolute bottom-5 right-5 z-50">
        {chatVisible && (
          <div ref={chatbotRef}>
            <ChatBot
              className="mb-8"
              steps={steps}
              handleEndChat={handleEndChat}
            />
          </div>
        )}
      </div>
      <div
        className="fixed bottom-5 right-5  w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer"
        onClick={toggleChatbot}
      >
        <span className="text-2xl font-bold">🤖</span>
      </div>
    </div>
  );
};

export default About;

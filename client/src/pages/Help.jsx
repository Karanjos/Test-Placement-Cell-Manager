import { useState } from "react";
import { CSSTransition } from "react-transition-group"; //npm install react-transition-group
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useRef, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { Badge, Button } from "flowbite-react";

export default function Help() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

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
      message: `you can contact Akhil Patwal
        Email:akhilpatwal4@gmail.com`,
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

  const questionsList = [
    {
      question: "What is the objective of this portal?",
      answer:
        "The Placement Cell plays a crucial role in locating job opportunities for under graduates and post graduates passing out from the college by keeping in touch with reputed firms and industrial establishments. The placement cell operates round the year to facilitate contacts between companies and graduates. The number of students placed through the campus interviews is continuously rising.",
    },
    {
      question: "Do you find any problem during login or registration?",
      answer:
        "If you are facing any problem during login or registration, please contact the placement cell. If you are having any trouble during registration, you can reach out to us via the contact page.",
    },
    {
      question: "How much time, one need to wait for the account approval?",
      answer:
        "Once the Training and placement officer approves your candidature, then you will be able to login successfully using your credentials.",
    },
    {
      question: "still facing any problem, what to do?",
      answer:
        "If you are still facing any problem, you can reach out to us via the contact page. We will try to resolve your issue as soon as possible or you can contact the placement cell for further assistance.",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen dark:bg-slate-900">
      <div className="max-w-6xl mx-auto pt-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className=" mr-5">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl ">
              Frequently Asked{" "}
              <span className="text-purple-600">Questions</span> About Us!
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-300">
              Any queries or doubts regarding the Placement Portal will be
              addressed here. Students might get confused regarding the
              placement portal, and their queries will be solved.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2 hover:scale-105 transition-all duration-300">
            <img
              src="https://t4.ftcdn.net/jpg/01/28/17/47/360_F_128174778_0XvhB1qi70yXNOPuUFzBNT85xKaWnVde.jpg"
              alt="Placeholder"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
        <div className="mt-12">
          <ul>
            {questionsList.map((item, index) => (
              <li
                key={index}
                className="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
              >
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="w-full relative flex items-center justify-between cursor-pointer px-6 py-4 bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
                  onClick={() => toggleQuestion(index)}
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 8 8"
                      className="fill-current"
                    >
                      <path d="M4.47 0c-.85 0-1.48.26-1.88.66c-.4.4-.54.9-.59 1.28l1 .13c.04-.25.12-.5.31-.69C3.5 1.19 3.8 1 4.47 1c.66 0 1.02.16 1.22.34c.2.18.28.4.28.66c0 .83-.34 1.06-.84 1.5c-.5.44-1.16 1.08-1.16 2.25V6h1v-.25c0-.83.31-1.06.81-1.5c.5-.44 1.19-1.08 1.19-2.25c0-.48-.17-1.02-.59-1.41C5.95.2 5.31 0 4.47 0m-.5 7v1h1V7z" />
                    </svg>
                  </span>

                  <span className="ml-2 font-semibold ">{item.question}</span>
                  <span className=" absolute right-5">
                    {activeQuestion === index ? (
                      <FiChevronUp size={24} />
                    ) : (
                      <FiChevronDown size={24} />
                    )}
                  </span>
                </Button>
                <CSSTransition
                  in={activeQuestion === index}
                  timeout={50}
                  classNames="answer"
                  unmountOnExit
                >
                  <div
                    className="px-6 py-4 transition-all duration-300 ease-in-out transform"
                    enterClassName="opacity-0 -translate-y-2"
                    enterToClassName="opacity-100 translate-y-0"
                    exitClassName="opacity-100 translate-y-0"
                    exitToClassName="opacity-0 -translate-y-2"
                  >
                    <p className="text-gray-700 leading-7 hover:scale-95 transition-all duration-300">
                      {item.answer}
                    </p>
                  </div>
                </CSSTransition>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="">
        {chatVisible && (
          <div ref={chatbotRef}>
            <ChatBot
              className="md:mb-8 px-3"
              steps={steps}
              handleEndChat={handleEndChat}
            />
          </div>
        )}
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={toggleChatbot}
          pill
          className="md:fixed bottom-5 right-10 z-50 hidden md:block"
        >
          <span className="text-2xl font-bold">🤖</span>
        </Button>
        <div className="p-3 flex gap-2 items-center">
          <Badge className="md:hidden">Need Help?</Badge>
          <Button
            className="md:hidden text-center w-full"
            gradientDuoTone="purpleToBlue"
            onClick={toggleChatbot}
          >
            <span className="text-2xl font-bold">🤖</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "../ui/button";
import axios from "axios";

// Initial questions
const INITIAL_QUESTIONS = [
  { id: "1", content: "What are my legal rights in this situation?" },
  { id: "2", content: "How do I proceed with filing a case?" },
  { id: "3", content: "Can you guide me on contract law?" },
  { id: "4", content: "What is the process for legal consultation?" },
];

// ChatTopbar Component (Placeholder for future use)
function ChatTopbar() {
  return null;
}

// ChatList Component
function ChatList({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  formRef,
  isMobile,
}: any) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState<string>("");
  const [initialQuestions, setInitialQuestions] = useState<any[]>([]);
  const [uploadEnabled, setUploadEnabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load username from local storage
  useEffect(() => {
    const username = localStorage.getItem("ollama_user");
    if (username) setName(username);
  }, []);

  // Load initial questions when there are no messages
  useEffect(() => {
    if (messages.length === 0) {
      const questionCount = isMobile ? 2 : 4;
      setInitialQuestions(
        INITIAL_QUESTIONS.sort(() => Math.random() - 0.5).slice(0, questionCount)
      );
    }
  }, [isMobile]);

  const onClickQuestion = (value: string, e: React.MouseEvent) => {
    e.preventDefault();
    handleInputChange({
      target: { value },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    setTimeout(() => {
      formRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }, 1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setSelectedFile(event.target.files[0]);
  };

  const toggleUpload = () => {
    setUploadEnabled(!uploadEnabled);
    setSelectedFile(null);
  };

  // Display the initial screen if there are no messages
  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="relative flex flex-col gap-4 items-center justify-center w-full h-full">
          <Image
            src={require("../../../public/legalX.png")}
            alt="AI"
            width={150}
            height={150}
            className="dark:invert hidden 2xl:block"
          />
          <p className="text-center text-lg text-muted-foreground mt-2">
            How may I assist with your legal concerns today?
          </p>

          <div className="mt-4 w-full px-4 sm:max-w-3xl grid gap-2 sm:grid-cols-2 sm:gap-4 text-sm">
            {initialQuestions.map((question) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.1 }}
              >
                <Button
                  variant="outline"
                  className="px-4 py-8 flex w-full justify-center sm:justify-start items-center text-sm"
                  onClick={(e) => onClickQuestion(question.content, e)}
                >
                  {question.content}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* File Upload Checkbox */}
        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            id="enableUpload"
            checked={uploadEnabled}
            onChange={toggleUpload}
            className="mr-2"
          />
          <label htmlFor="enableUpload">Upload a PDF file</label>
        </div>

        {/* File Upload Field */}
        {uploadEnabled && (
          <div className="mt-2">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="file-input"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-muted-foreground">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-end">
      <div
        id="scroller"
        className="w-full overflow-y-scroll overflow-x-hidden h-full justify-end"
      >
        <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
          {messages.map((message: any, index: number) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.1 }}
              className={`flex flex-col gap-2 p-4 whitespace-pre-wrap ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="flex gap-3 items-center">
                {message.role === "user" && (
                  <div className="flex items-end gap-3">
                    <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      {typeof message.content === "string" ? message.content : JSON.stringify(message.content)}
                    </span>
                    <Avatar className="flex justify-start items-center overflow-hidden">
                      <AvatarImage
                        src="/"
                        alt="user"
                        className="object-contain"
                      />
                      <AvatarFallback>
                        {name && name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {message.role === "assistant" && (
                  <div className="flex items-end gap-2">
                    <Avatar className="flex justify-start items-center">
                      <AvatarImage
                        src="/legalX.png"
                        alt="AI"
                        className="object-contain dark:invert"
                      />
                    </Avatar>
                    <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {typeof message.content === "string" ? message.content : JSON.stringify(message.content)}
                      </Markdown>
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

// ChatBottombar Component
function ChatBottombar({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  formRef,
}: any) {
  return (
    <div className="w-full flex flex-col items-center">
      <form
        className="relative flex items-center gap-2 w-full px-4 py-2 border-t border-border"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <textarea
          className="flex w-full resize-none h-[40px] bg-background focus:outline-none"
          rows={1}
          value={input}
          placeholder="Ask me anything..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          disabled={isLoading || input.length === 0}
          className={`relative flex justify-center items-center gap-2 transition-colors ${
            isLoading ? "cursor-wait" : ""
          }`}
        >
          Send
        </button>
      </form>
      <Button variant="link" size="sm">
        Stop Generating
      </Button>
    </div>
  );
}

// Main Chat Component
export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://13.235.73.131/ask", { question: input });
      // Assuming the answer is in response.data.answer
      const answer = response.data.answer || response.data;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatTopbar />
      <ChatList
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        formRef={formRef}
        isMobile={isMobile}
      />
      <ChatBottombar
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        formRef={formRef}
      />
    </div>
  );
}

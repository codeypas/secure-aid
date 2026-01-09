import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { marked } from "marked";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { tokenPayload } from "../../types/types";

interface ChatEntry {
  prompt: string;
  response: string;
}

const Chatbot: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [email, setEmail] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Decode token and fetch location
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const decoded: tokenPayload = jwtDecode(token);
    const userEmail = decoded.sub.email;
    setEmail(userEmail);

    const fetchLocation = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/user/get-location", {
          email: userEmail,
        });
        setLat(res.data.lat);
        setLon(res.data.lon);
      } catch (error) {
        console.error("Error fetching user location", error);
      }
    };

    fetchLocation();
  }, []);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    try {
      setUserInput("");

      const response = await axios.post("http://localhost:5000/api/chatbot/chat", {
        prompt: userInput,
        email,
        lat,
        lon,
      });

      const responseHtml = marked.parse(response.data.answer || "").toString();

      setChatHistory((prev) => [
        ...prev,
        {
          prompt: userInput,
          response: responseHtml || "No response from API",
        },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          prompt: userInput,
          response: "Error fetching response from API",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      <div className="flex flex-col flex-grow overflow-y-auto p-6 space-y-6 pb-24 md:pb-16 mb-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-start">
              <div className="max-w-xl px-4 py-3 bg-white rounded-lg shadow">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {chat.prompt}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-xl px-4 py-3 bg-blue-100 rounded-lg shadow">
                <p
                  className="text-gray-800 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: chat.response }}
                />
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="max-w-xl px-4 py-3 bg-blue-100 rounded-lg shadow italic text-gray-500">
              Chatbot answer is loading...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white fixed bottom-12 md:bottom-0 left-0 w-full">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-grow px-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

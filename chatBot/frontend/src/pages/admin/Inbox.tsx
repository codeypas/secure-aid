import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface InboxMessage {
  id: number;
  email: string;
  message: string;
  dateTime: string;
}

const Inbox = () => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/inbox")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch inbox messages", err));
  }, []);

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📥 Admin Inbox</h2>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            No messages found.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 hover:bg-gray-50 transition cursor-pointer group"
              onClick={() => navigate(`/admin/${msg.id}`)}
            >
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium group-hover:underline">
                  {msg.email}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(msg.dateTime).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 mt-2 text-sm line-clamp-2">
                {msg.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
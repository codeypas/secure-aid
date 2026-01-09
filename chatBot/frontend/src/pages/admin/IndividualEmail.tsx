import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface InboxMessage {
  id: number;
  email: string;
  message: string;
  dateTime: string;
}

const extractLatLon = (text: string): string | null => {
  const regex = /(-?\d+\.\d+)\D+(-?\d+\.\d+)/;
  const match = text.match(regex);
  return match ? `${match[1]}, ${match[2]}` : null;
};

const IndividualEmail = () => {
  const { id } = useParams();
  const [message, setMessage] = useState<InboxMessage | null>(null);
  const [coords, setCoords] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/inbox/${id}`)
      .then((res) => {
        setMessage(res.data);
        const extracted = extractLatLon(res.data.message);
        setCoords(extracted);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch email by ID", err);
        setError("No email found with the given ID.");
      });
  }, [id]);

  const handleCopy = () => {
    if (coords) {
      navigator.clipboard.writeText(coords);
      alert("Coordinates copied to clipboard: " + coords);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen px-6 py-10 bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            404 - Not Found
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="p-6 text-center text-gray-500">Loading email...</div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          ✉️ Message from <span className="text-blue-600">{message.email}</span>
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Received on {new Date(message.dateTime).toLocaleString()}
        </p>
        <div className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed border-t pt-4 mb-4">
          {message.message}
        </div>
        {coords && (
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            📍 Copy Coordinates ({coords})
          </button>
        )}
      </div>
    </div>
  );
};

export default IndividualEmail;
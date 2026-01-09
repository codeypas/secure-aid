import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { SendHorizonal, X } from "lucide-react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

interface User {
  id: number;
  name: string;
  distance_km: number;
  email: string;
}

const AdminDashboard = () => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("20");
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [locOrLatLon, setLocOrLatLon] = useState(true);
  const [subject, setSubject] = useState("");
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  // Initialize Quill editor
  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
    placeholder: "Compose your message...",
  });

  // Set up quill change listener
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setEditorContent(quill.root.innerHTML);
      });
    }
  }, [quill]);

  // Toggle editor visibility
  const toggleEditorVisibility = useCallback(() => {
    setIsEditorVisible((prev) => !prev);
  }, []);

  // Handle search functionality
  const handleSearch = async () => {
    if (locOrLatLon) {
      if (!location.trim()) {
        alert("Please enter a location and radius");
        return;
      }
    } else {
      if (lat.trim() === "" || lon.trim() === "" || radius.trim() === "") {
        alert("Please enter latitude, longitude and radius");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = locOrLatLon
        ? { address: location, radius: parseFloat(radius), location_addr: true }
        : {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            radius: parseFloat(radius),
            location_addr: false,
          };

      const { data } = await axios.post(
        "http://localhost:5000/api/admin/location/haversine",
        payload
      );

      setUsers(data);
      setSelected([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Handle dropdown change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setLocOrLatLon(value !== "latlon");
  };

  // Toggle user selection
  const toggleSelect = (email: string) => {
    setSelected((prevSelected) => {
      const newSelected = prevSelected.includes(email)
        ? prevSelected.filter((e) => e !== email)
        : [...prevSelected, email];

      // Show editor automatically if at least one user is selected
      if (newSelected.length > 0 && !isEditorVisible) {
        setIsEditorVisible(true);
      }

      return newSelected;
    });
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    if (!editorContent.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/send-message", {
        emails: selected.map((email) => ({ emailId: email })),
        subject,
        body: editorContent,
      });

      // Clear form after successful send
      setSubject("");
      if (quill) {
        quill.setText("");
      }
      setEditorContent("");
      setIsEditorVisible(false);

      alert("Message sent successfully!");
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-gray-50 min-h-screen pb-[340px] relative">
      {/* Search form */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch bg-white p-4 sm:p-8 rounded-xl shadow-lg">
        <select
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 w-full sm:w-auto"
        >
          <option value="location">Location</option>
          <option value="latlon">Latitude/Longitude</option>
        </select>

        {locOrLatLon ? (
          <input
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 w-full sm:w-auto"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 w-full sm:w-40"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            <input
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 w-full sm:w-40"
              placeholder="Longitude"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
          </div>
        )}

        <input
          className="w-full sm:w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
          placeholder="Radius km"
          value={radius}
          onChange={(e) => setRadius(e.target.value.replace(/[^0-9.]/g, ""))}
        />

        <button
          onClick={handleSearch}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 hover:cursor-pointer"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Users table */}
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-blue-100 text-left text-base font-semibold">
                <th className="p-3 sm:p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded"
                    checked={
                      selected.length === users.length && users.length > 0
                    }
                    onChange={() => {
                      if (selected.length === users.length) {
                        setSelected([]);
                        if (isEditorVisible && selected.length === 0) {
                          setIsEditorVisible(false);
                        }
                      } else {
                        setSelected(users.map((u) => u.email));
                        setIsEditorVisible(true);
                      }
                    }}
                  />
                </th>
                <th className="p-3 sm:p-4">ID</th>
                <th className="p-3 sm:p-4">Name</th>
                <th className="p-3 sm:p-4">Email</th>
                <th className="p-3 sm:p-4">Distance&nbsp;(km)</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-blue-50 transition">
                  <td className="p-3 sm:p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded"
                      checked={selected.includes(u.email)}
                      onChange={() => toggleSelect(u.email)}
                    />
                  </td>
                  <td className="p-3 sm:p-4">{u.id}</td>
                  <td className="p-3 sm:p-4">{u.name}</td>
                  <td className="p-3 sm:p-4">{u.email}</td>
                  <td className="p-3 sm:p-4">{u.distance_km.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h1 className="text-lg text-gray-600">No users found</h1>
        </div>
      )}

      {/* Gmail-like Email Composer (without dropdown functionality) */}
      <div
        className={`fixed bottom-0 right-4 w-full max-w-lg z-50 bg-white border border-gray-200 rounded-t-lg overflow-hidden shadow-2xl transition-all duration-300 ${
          isEditorVisible ? "block" : "hidden"
        } h-[460px] mb-10 md:mb-0`}
      >
        {/* Composer Header */}
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-800">New Message</h2>
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={toggleEditorVisibility}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Recipients */}
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-sm text-gray-500 min-w-[80px]">To:</span>
            <div className="flex-1">
              {selected.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selected.slice(0, 4).map((email) => (
                    <div
                      key={email}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      {email}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(email);
                        }}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {selected.length > 4 && (
                    <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center">
                      + {selected.length - 4} more
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-sm text-gray-400">
                  Select recipients from the table above
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        <div className="px-4 py-2 border-b border-gray-200">
          <input
            type="text"
            className="w-full px-1 py-1 focus:outline-none text-sm"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Editor */}
        <div className="bg-white">
          <div
            ref={quillRef}
            style={{
              height: 200,
              background: "white",
              borderBottom: "1px solid #e5e7eb",
            }}
          />
        </div>

        {/* Footer Toolbar */}
        <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                selected.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } transition-colors duration-200`}
              onClick={handleSendMessage}
              disabled={selected.length === 0}
            >
              <span className="flex items-center gap-2">
                <SendHorizonal size={16} />
                Send
              </span>
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {selected.length} recipient{selected.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

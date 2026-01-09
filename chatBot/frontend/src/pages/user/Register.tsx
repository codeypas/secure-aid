import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  lat: string;
  lon: string;
  role: "user" | "admin";
}

function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    lat: "",
    lon: "",
    role: "user",
  });

  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const requestLocation = () => {
    console.log("Requesting location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const lat = position.coords.latitude.toFixed(5);
          const lon = position.coords.longitude.toFixed(5);
          setFormData((prev) => ({
            ...prev,
            lat: lat,
            lon: lon,
          }));
          setMessage("");
        },
        (error) => {
          if (error.code === 1) {
            setMessage(
              "You denied location access. Please allow it to use disaster management features."
            );
          } else if (error.code === 2) {
            setMessage(
              "Location unavailable. Please check your device settings."
            );
          } else if (error.code === 3) {
            setMessage("Location request timed out. Please try again.");
          } else {
            setMessage("An unknown error occurred while requesting location.");
          }
          console.error(error);
        }
      );
    } else {
      setMessage("Geolocation is not supported by your browser.");
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", formData, { withCredentials: true })
      setMessage("User registered successfully!");
      navigate("/login");
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Register
        </h2>

        <input
          className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-2 flex-col">
            <input
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="lat"
              placeholder="Latitude"
              value={formData.lat}
              onChange={handleChange}
              readOnly
            />
            <input
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              name="lon"
              placeholder="Longitude"
              value={formData.lon}
              onChange={handleChange}
              readOnly
            />
          </div>
          <button
            type="button"
            onClick={requestLocation}
            className="bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-600 transition text-sm hover:cursor-pointer"
          >
            Detect Location
          </button>
        </div>

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Register
        </button>
        <div className="flex items-center justify-center mt-4">
          Already have an account?{" "} <a href="/login" className="text-blue-600 hover:underline ml-2">Login</a>
        </div>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </form>
    </div>
  );
}

export default RegisterPage;

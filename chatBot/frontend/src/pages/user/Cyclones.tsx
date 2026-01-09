import axios from "axios";
import { useEffect, useState } from "react";

const Cyclones = () => {
  const [imgurl, setImgURL] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/disasters/graph/cyclones.png",
          { responseType: "blob" }
        );
        const imageUrl = URL.createObjectURL(response.data);
        setImgURL(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-0 md:px-4">
      {imgurl ? (
        <img
          src={imgurl}
          alt="Flood Graph"
          className="max-w-full max-h-full rounded shadow-lg"
        />
      ) : (
        <p className="text-gray-500 text-lg">Loading...</p>
      )}
    </div>
  );
};

export default Cyclones;

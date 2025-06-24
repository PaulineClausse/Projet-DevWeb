import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef } from "react";
const ProfilModify = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [image, setImage] = useState("");
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const getUser = async () => {
    try {
      const res = await axios.get(`https://zing.com/auth/user/${id}`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      console.log(res.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.message);
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Ouvre l’explorateur
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file)); // <-- prévisualisation immédiate

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("https://zing.com/auth/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const uploadedImage = res.data.filename || res.data.imageUrl;
      setImage(uploadedImage);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Échec de l'upload");
    }
  };

  const handleClose = () => setIsVisible(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Infos modifiées :", formData);
    try {
      axios.put(`https://zing.com/auth/update`, formData, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.message);
    }
    handleClose();
    window.location.reload();
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        biography: user.biography || "",
      });
    }
  }, [user]);
  if (!isVisible) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md z-10"
        onClick={handleClose}
      ></div>

      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   bg-neutral-800 rounded-3xl shadow-xl z-20 
                   w-[350px] p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Modifier mon profil
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder={user.username}
            className="w-full p-2 rounded bg-neutral-700 text-white placeholder-gray-400"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder={user.name}
            className="w-full p-2 rounded bg-neutral-700 text-white placeholder-gray-400"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="biography"
            placeholder={user.biography}
            className="w-full p-2 rounded bg-neutral-700 text-white placeholder-gray-400"
            value={formData.biography}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            onClick={handleButtonClick}
            className="w-20 h-20 mx-auto block bg-gray-600 rounded-full overflow-hidden "
          >
            <img
              src={
                previewImage
                  ? previewImage
                  : user?.image
                  ? `https://zing.com/auth/uploads/${user.image}`
                  : "../public/images/pdp_basique.jpeg"
              }
              className=" w-full h-full object-cover"
            />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="flex justify-center space-x-2">
            <button
              type="submit"
              className="px-3 py-1 bg-[rgb(41,162,173)] rounded hover:bg-blue-500 transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfilModify;

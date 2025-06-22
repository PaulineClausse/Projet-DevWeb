import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useRef } from "react";

const BASE_REPLY_ROWS = 1;

const ProfilPage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [userActual, setUserActual] = useState({});
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [likes, setLikes] = useState({});
  const [likesUsers, setLikesUsers] = useState({});
  const [showLikesList, setShowLikesList] = useState(null);
  const [replyTarget, setReplyTarget] = useState(null);

  // Récupère les infos d'un utilisateur et les met en cache
  const fetchUser = async (userId) => {
    if (!userId || users[userId]) return;
    try {
      const res = await axios.get(`http://localhost:5000/user/${userId}`, {
        withCredentials: true,
      });
      setUsers((prev) => ({ ...prev, [userId]: res.data.user }));
    } catch (e) {
      setUsers((prev) => ({ ...prev, [userId]: { username: "Utilisateur" } }));
    }
  };

  const handleClose = () => {
    setIsInputVisible(false);
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/posts/delete/${id}`, {
        withCredentials: true,
      });
      getUserPosts();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.message);
    }
  };

  const putPost = async (id) => {
    const data = { title, content, image };
    try {
      await axios.put(`http://localhost:3000/api/posts/modify/${id}`, data, {
        withCredentials: true,
      });
      getUserPosts();
      setIsInputVisible(false);
      setTitle("");
      setContent("");
      setImage("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.message);
    }
  };

  const handleClick = async () => {
    const data = { title, content, image };
    if (!title || !content) {
      return alert("Title and content are required");
    }
    try {
      if (editingPostId) {
        await putPost(editingPostId);
        setTitle("");
        setContent("");
        setImage("");
        setEditingPostId(null);
        setIsInputVisible(false);
        return;
      }
      await axios.post("http://localhost:3000/api/posts/create", data, {
        withCredentials: true,
      });
      getUserPosts();
      setIsInputVisible(false);
      setTitle("");
      setContent("");
      setImage("");
    } catch (error) {
      console.error("Erreur lors de la création :", error.message);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setImage(post.image);
    setIsInputVisible(true);
  };

  const getUserActual = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth", {
        withCredentials: true,
      });
      console.log("Utilisateur connecté :", response.data.user);
      setUserActual(response.data.user);
    } catch (error) {
      console.log("Pas connecté", error);
    }
  };

  const getUserPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/posts/user/${id}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setPosts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(
        `Erreur lors de la recherche des posts de l'utilisateur : ${error}`
      );
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${id}`, {
        withCredentials: true,
      });

      console.log("Utilisateur du profil :", response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.log("Pas d'utilisateur", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Ouvre l’explorateur
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    console.log("formdata : " + formData);
    console.log("file : " + file);
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const uploadedImage = res.data.filename || res.data.imageUrl;
      console.log("Image uploadée:", uploadedImage);

      setImage(uploadedImage);
      window.location.reload();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Échec de l'upload");
    }
  };

  const getfollow = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4003/followers/${user.user_id}/${id}`,
        { withCredentials: true }
      );
      if (res.data.isFollowing === true) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
      console.log(`L'utilisateur ${user.user_id} suit l'utilisateur ${id}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.message);
    }
  };

  const handlefollow = async () => {
    if (setIsFollowing) {
      setIsFollowing(false);
      return;
    } else {
      try {
        const res = await axios.post(
          `http://localhost:4003/followers/create/${user.user_id}/${id}`,
          { withCredentials: true }
        );
        console.log("Résultat de la requête POST :", res);
        setIsFollowing(true);
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error.message);
      }
    }
  };

  useEffect(() => {
    getUserPosts();
    getUserActual();
    getUserInfo();
    getfollow();
  
  // --- Commentaires & Likes ---
  const getComments = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/api/comments/post/${postId}`,
        { withCredentials: true }
      );
      setComments((prev) => ({
        ...prev,
        [postId]: response.data,
      }));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setComments((prev) => ({
          ...prev,
          [postId]: [],
        }));
      } else {
        console.log(error);
      }
    }
  };

  const getLikes = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:4002/api/likes/${postId}/users`,
        { withCredentials: true }
      );
      setLikes((prev) => ({
        ...prev,
        [postId]: response.data.users.length,
      }));
      setLikesUsers((prev) => ({
        ...prev,
        [postId]: response.data.users,
      }));
      response.data.users.forEach((userId) => fetchUser(userId));
    } catch (error) {
      setLikes((prev) => ({
        ...prev,
        [postId]: 0,
      }));
      setLikesUsers((prev) => ({
        ...prev,
        [postId]: [],
      }));
    }
  };

  const addComment = async (postId) => {
    if (!newComment) return alert("Le commentaire ne peut pas être vide");
    const commentData = {
      post_id: postId,
      content: newComment,
    };
    try {
      await axios.post("http://localhost:4001/api/comments/", commentData, {
        withCredentials: true,
      });
      setNewComment("");
      getComments(postId);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    }
  };

  const addReply = async (postId, commentId) => {
    if (!replyTarget?.value) return alert("La réponse ne peut pas être vide");
    try {
      await axios.post(
        `http://localhost:4001/api/comments/${commentId}/reply`,
        {
          post_id: postId,
          content: replyTarget.value,
        },
        { withCredentials: true }
      );
      setReplyTarget(null);
      getComments(postId);
    } catch (error) {
      console.error("Erreur lors de la réponse :", error);
    }
  };

  const deleteComment = async (commentId, postId, parentId = null) => {
    try {
      if (parentId) {
        await axios.delete(
          `http://localhost:4001/api/comments/${parentId}/reply/${commentId}`,
          { withCredentials: true }
        );
      } else {
        await axios.delete(
          `http://localhost:4001/api/comments/${commentId}`,
          { withCredentials: true }
        );
      }
      getComments(postId);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
    }
  };

  const toggleLike = async (postId) => {
    try {
      await axios.post(
        "http://localhost:4002/api/likes/",
        {
          post_id: postId,
        },
        { withCredentials: true }
      );
      getLikes(postId);
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  };

  const toggleComments = (postId) => {
    if (activePostId === postId) {
      setActivePostId(null);
    } else {
      setActivePostId(postId);
      getComments(postId);
    }
  };

  const renderCommentWithReplies = (comment, postId, allComments, level = 0) => {
    const replies = allComments.filter((c) => c.parent_id === comment._id);

    return (
      <div
        key={comment._id}
        className={`my-2 ${level === 0 ? "p-3 bg-gradient-to-r from-[rgba(38,38,38,0.95)] to-[rgba(119,191,199,0.15)] border-l-4 border-[rgba(119,191,199,0.7)] rounded-md shadow-sm" : ""}`}
      >
        <div className="flex justify-between items-center mb-1" style={level > 0 ? { marginLeft: `${level * 2}rem` } : {}}>
          <div className="flex items-center gap-2">
            <img
              src={comment.user?.image || "/images/pdp_test.jpg"}
              alt="Avatar"
              className={`rounded-full border-2 border-white object-cover ${level === 0 ? "w-7 h-7" : "w-5 h-5"}`}
            />
            <span className={`font-semibold ${level === 0 ? "text-[rgba(119,191,199,0.9)]" : "text-cyan-300 text-sm"}`}>
              {comment.user?.username || "Utilisateur"}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {comment.date ? new Date(comment.date).toLocaleString("fr-FR") : ""}
          </span>
        </div>
        <div className="flex justify-between items-center" style={level > 0 ? { marginLeft: `${level * 2}rem` } : {}}>
          <p className={`text-gray-100 ${level > 0 ? "text-sm" : ""}`}>{comment.content}</p>
          <button
            onClick={() => deleteComment(comment._id, postId, comment.parent_id)}
            className="ml-4 text-red-400 hover:text-red-600 transition"
            title="Supprimer le commentaire"
          >
            <img src="/icons/delete.png" alt="Supprimer" className={level === 0 ? "w-5 h-5" : "w-4 h-4"} />
          </button>
        </div>
        <button
          className="text-xs text-blue-400 mt-1"
          style={level > 0 ? { marginLeft: `${level * 2}rem` } : {}}
          onClick={() => setReplyTarget({ commentId: comment._id, value: "", rows: BASE_REPLY_ROWS })}
        >
          Répondre
        </button>
        {replyTarget && replyTarget.commentId === comment._id && (
          <div className="mt-2 flex flex-col gap-1" style={level > 0 ? { marginLeft: `${level * 2}rem` } : {}}>
            <textarea
              value={replyTarget.value}
              onChange={e => {
                const lines = e.target.value.split("\n").length;
                setReplyTarget(rt => ({
                  ...rt,
                  value: e.target.value,
                  rows: Math.max(BASE_REPLY_ROWS, lines)
                }));
              }}
              placeholder="Votre réponse..."
              className="w-full p-2 rounded border bg-gray-800 text-gray-100"
              rows={replyTarget.rows}
              style={{ resize: "none" }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => addReply(postId, comment._id)}
                className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded text-xs"
              >
                Répondre
              </button>
              <button
                onClick={() => setReplyTarget(null)}
                className="px-2 py-1 text-xs text-gray-400 hover:text-red-400"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
        {replies.length > 0 && (
          <div>
            {replies.map((reply) =>
              renderCommentWithReplies(reply, postId, allComments, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const displayComments = (postId) => {
    const postComments = comments[postId] || [];
    return (
      <div className="pt-4">
        {postComments
          .filter((c) => !c.parent_id)
          .map((comment) => renderCommentWithReplies(comment, postId, postComments))}
      </div>
    );
  };

  // Récupération de l'utilisateur connecté via le cookie (token)
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        getPosts();
      })
      .catch(() => window.location.href = "/auth");
  }, []);

  useEffect(() => {
    posts.forEach((post) => {
      fetchUser(post.user_id);
      getLikes(post._id);
    });
  }, [posts]);

  return (
    <div className="min-h-screen flex flex-col mx-auto px-4 gap-5">
      <Navbar />
      {/* Menu vertical à gauche (bulle) */}
      <nav className="hidden md:flex flex-col fixed top-60 left-3 xl:left-16 text-white bg-[rgb(38,38,38)] rounded-2xl shadow-2xl w-40 p-4 space-y-7 z-30">
        <a
          href="/home"
          className="hover:text-blue-400 flex items-center space-x-2"
        >
          <img
            src="/images/acceuil.png"
            alt="Accueil"
            className="w-7 h-7 rounded-full"
          />
          <span>Home</span>
        </a>
        <a
          href="/followers"
          className="hover:text-blue-400 flex items-center space-x-2"
        >
          {/* Pas d'image pour followers */}
          <span>Followers</span>
        </a>
        <a
          href="/profil"
          className="flex px-2 items-center gap-x-4 hover:text-blue-400"
        >
          <img
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
            src="/images/pdp_test.jpg"
            alt="Profile"
          />
          <span className="text-white hover:text-blue-400">Profil</span>
        </a>
      </nav>
      <div className="flex flex-col">
        <div className="mt-20 flex justify-center">
          <div className=" shadow-2xl  bg-[rgb(38,38,38,0.7)] text-white p-16 w-10/12 right-10 md:w-9/12 top-36 absolute rounded-lg">
            <h1 className="absolute -top-10 left-0 text-3xl font-bold text-white">
              Profil
            </h1>
            {userActual.user_id == user.user_id && (
              <button
                onClick={handleButtonClick}
                className="absolute -top-9 left-24"
              >
                <img src="../public/icons/modify.png" className="w-7 h-7"></img>
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div className="flex flex-col ">
              <div className="absolute  top-4 left-4 flex flex-row items-center gap-8">
                <p className="font-bold text-xl ">{user.name} </p>

                <p className=" text-gray-300 text-lg ">@{user.username}</p>
              </div>
              <div>
                <p className="absolute left-4 top-12">{user.biography}</p>

                <div className="absolute flex flex-row  left-3 gap-3 mt-5 ">
                  <button
                    onClick={() => handlefollow()}
                    className="text-sm font-medium flex flex-col items-center "
                  >
                    {isFollowing ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-green-500"
                        viewBox="0 0 512 512"
                      >
                        <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-277.02 97.941l184-184c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.971 0L216 284.118l-70.745-70.745c-4.686-4.686-12.284-4.686-16.971 0L100 241.657c-4.686 4.686-4.686 12.284 0 16.971l100 100c4.686 4.686 12.284 4.686 16.971.001z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        viewBox="0 0 640 512"
                      >
                        <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                      </svg>
                    )}
                    <span className="text-xs font-medium">
                      {isFollowing ? "Following" : "Follow"}
                    </span>
                  </button>
                  <button
                    onClick={() => navigate("/followers")}
                    className="text-sm font-medium flex flex-col items-center "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      viewBox="0 0 448 512"
                    >
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                    </svg>
                    <span className="text-xs">Followers</span>
                  </button>
                  <button
                    onClick={() => navigate("/home")}
                    className="text-sm font-medium flex flex-col items-center"
                  >
                    <svg
                      className="w-6 h-6 "
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 310.745 310.745"
                      xml:space="preserve"
                    >
                      <g id="XMLID_341_">
                        <path
                          id="XMLID_348_"
                          d="M77.622,120.372c9.942,0,19.137-3.247,26.593-8.728c11.382,16.007,30.063,26.479,51.157,26.479
		c21.093,0,39.774-10.472,51.157-26.479c7.456,5.481,16.651,8.728,26.593,8.728c24.813,0,45-20.187,45-44.999
		c0-24.814-20.187-45.001-45-45.001c-9.943,0-19.138,3.248-26.594,8.729c-11.383-16.006-30.063-26.478-51.156-26.478
		c-21.093,0-39.773,10.472-51.156,26.478c-7.456-5.481-16.651-8.729-26.594-8.729c-24.813,0-45,20.187-45,45.001
		C32.622,100.186,52.809,120.372,77.622,120.372z M233.122,60.372c8.271,0,15,6.73,15,15.001c0,8.271-6.729,14.999-15,14.999
		c-8.271,0-15-6.729-15-14.999C218.122,67.102,224.851,60.372,233.122,60.372z M155.372,42.623c18.059,0,32.75,14.691,32.75,32.75
		s-14.691,32.75-32.75,32.75c-18.059,0-32.75-14.691-32.75-32.75S137.313,42.623,155.372,42.623z M77.622,60.372
		c8.271,0,15,6.73,15,15.001c0,8.271-6.729,14.999-15,14.999s-15-6.729-15-14.999C62.622,67.102,69.351,60.372,77.622,60.372z"
                        />
                        <path
                          id="XMLID_440_"
                          d="M233.122,150.372c-19.643,0-38.329,7.388-52.584,20.532c-8.103-1.816-16.523-2.781-25.166-2.781
		c-8.643,0-17.063,0.965-25.165,2.781c-14.255-13.144-32.942-20.532-52.585-20.532C34.821,150.372,0,185.194,0,227.995
		c0,8.284,6.716,15,15,15h32.6c-4.669,12.5-7.228,26.019-7.228,40.127c0,8.284,6.716,15,15,15h200c8.284,0,15-6.716,15-15
		c0-14.108-2.559-27.627-7.229-40.127h32.602c8.284,0,15-6.716,15-15C310.745,185.194,275.923,150.372,233.122,150.372z
		 M32.42,212.995c6.298-18.934,24.181-32.623,45.202-32.623c6.617,0,13.052,1.382,18.964,3.95
		c-12.484,7.456-23.443,17.209-32.29,28.673H32.42z M71.697,268.122c7.106-39.739,41.923-69.999,83.675-69.999
		c41.751,0,76.569,30.26,83.675,69.999H71.697z M246.449,212.995c-8.848-11.464-19.806-21.217-32.29-28.673
		c5.912-2.567,12.347-3.95,18.964-3.95c21.021,0,38.905,13.689,45.203,32.623H246.449z"
                        />
                      </g>
                    </svg>
                    <span className="text-xs">Following</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <img
            className=" absolute lg:w-24 lg:h-24/12 md:w-24 md:h-24 right-2 mt-2  rounded-full w-28 h-28  object-cover border-2 border-white"
            src={
              user?.image
                ? `http://localhost:5000/uploads/${user.image}`
                : "../public/images/pdp_basique.jpeg"
            }
            alt="Profile"
          />
        </div>
        <div className=" flex-grow  pb-32 px-4 py-60">
          {isloading ? (
            "Loading..."
          ) : (
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className=" relative mt-5 top-16  bg-[rgba(38,38,38,0.5)]   bg-opacity-80 rounded-lg p-5 shadow-[2px_1px_8px_rgba(255,255,255,0.15)]  max-w-md mx-auto"
                  >
                    {/* En-tête : avatar + pseudo + date */}
                    <header className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            user?.image
                              ? `http://localhost:5000/uploads/${user.image}`
                              : "../public/images/pdp_basique.jpeg"
                          }
                          alt="Avatar"
                          className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between space-x-3">
                            <div>
                              <h3 className=" text-[rgba(119,191,199,0.5)] font-semibold text-lg">
                                {user.username || "Pseudo"}
                              </h3>
                              <time className="text-gray-400 text-xs">
                                {new Date(post.date).toLocaleString("fr-FR")}
                              </time>
                              {userActual.user_id == post.userId && (
                                <svg
                                  onClick={handleEditClick.bind(null, post)}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  fill="rgb(38, 38, 38)"
                                  className="absolute top-3 right-12 w-6 h-6   cursor-pointer"
                                >
                                  <path
                                    d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                                    stroke="rgb(191, 191, 199)"
                                    stroke-width="40"
                                  />
                                </svg>
                              )}
                            </div>
                            {userActual.user_id === post.userId && (
                              <svg
                                onClick={() => deletePost(post._id)}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                fill="rgb(38, 38, 38)"
                                className="absolute top-3 right-3 w-5 h-6   cursor-pointer"
                              >
                                <path
                                  d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                                  stroke="rgb(191, 191, 199)"
                                  strokeWidth="40"
                                />
                              </svg>
                             
                            )}
                          </div>
                        </div>
                      </div>
                    </header>
                    {post.title && (
                      <h2 className="text-white text-xl font-bold mb-2">{post.title}</h2>
                    )}
                    <p className="text-gray-200 text-base leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <section className="flex items-center justify-between text-gray-300">
                      <div className="flex space-x-6">
                        <button
                          className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-200"
                          onClick={() => toggleLike(post._id)}
                        >
                          <img
                            className="w-6 h-6"
                            src="/icons/like.png"
                            alt="Like"
                          />
                          <span>Like</span>
                          <span
                            className="ml-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowLikesList(showLikesList === post._id ? null : post._id);
                            }}
                          >
                            {likes[post._id] || 0}
                          </span>
                        </button>
                        <button
                          onClick={() => toggleComments(post._id)}
                          className="flex items-center space-x-1 hover:text-green-400 transition-colors duration-200"
                        >
                          <img
                            className="w-6 h-6"
                            src="/icons/comment.png"
                            alt="Comment"
                          />
                          <span>Comment</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-purple-400 transition-colors duration-200">
                          <img
                            className="w-6 h-6"
                            src="/icons/share.png"
                            alt="Share"
                          />
                          <span>Share</span>
                        </button>
                      </div>
                    </section>
                    {/* Liste des utilisateurs ayant liké */}
                    {showLikesList === post._id && (
                      <div className="absolute bg-gray-800 text-white rounded p-2 z-50 mt-2 left-0 right-0 max-w-xs mx-auto">
                        <h4 className="font-bold mb-2">Likes</h4>
                        <ul>
                          {(likesUsers[post._id] || []).map((userId) => (
                            <li key={userId} className="flex items-center gap-2 mb-1">
                              <img
                                src={users[userId]?.image || "/images/pdp_test.jpg"}
                                alt="Avatar"
                                className="w-6 h-6 rounded-full border"
                              />
                              <span>{users[userId]?.username || "Utilisateur"}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className="mt-2 text-sm text-blue-400"
                          onClick={() => setShowLikesList(null)}
                        >
                          Fermer
                        </button>
                      </div>
                    )}
                    {activePostId === post._id && (
                      <div className="comments-section">
                        {displayComments(post._id)}
                        <div className="mt-6 flex flex-col gap-2">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Ajouter un commentaire"
                            className="w-full p-3 rounded-xl border-2 border-[rgba(119,191,199,0.5)] bg-[rgba(38,38,38,0.8)] text-gray-100 focus:outline-none focus:ring-2 focus:ring-[rgba(119,191,199,0.7)] transition"
                            rows={2}
                          />
                          <button
                            onClick={() => addComment(post._id)}
                            className="self-end px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-md hover:from-blue-700 hover:to-cyan-600 transition"
                          >
                            Ajouter un commentaire
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-zinc-600 px-10 py-20 min-h-[400px]">
                  {" "}
                  You don't have any posts to view.
                </p>
              )}
            </>
          )}
        </div>
        {/* FORMULAIRE AJOUT POST CENTRÉ EN BAS */}
        {isInputVisible && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
              onClick={handleClose}
            ></div>
            <div
              className="
                fixed left-1/2 bottom-8 transform -translate-x-1/2
                w-5/6 max-w-md px-4 py-3 gap-4 flex flex-col
                bg-[rgb(50,50,50)] rounded-3xl shadow-2xl z-20
                sm:flex-row sm:items-center
              "
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={user?.image || "./images/pdp_test.jpg"}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <input
                type="text"
                placeholder="Titre du post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 text-2xl sm:text-4xl font-bold outline-none placeholder-gray-400 bg-gray-800 text-white mb-2 sm:mb-0 rounded-xl"
              />
              <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-3xl px-4 py-3 flex-1">
                <input
                  type="text"
                  id="content"
                  placeholder="Écris quelque chose..."
                  autoFocus
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 text-white placeholder-gray-400 outline-none bg-transparent"
                />
                <button
                  className="ml-3 p-2 hover:bg-white/20 rounded-full transition flex-shrink-0"
                  onClick={handleClick}
                >
                  <img
                    className="w-6 h-6"
                    src="/icons/publish.png"
                    alt="Publish icon"
                  />
                </button>
              </div>
            </div>
          </>
        )}
        
        <div className="fixed shadow-lg border border-gray-600 bg-black/30 rounded-full w-11 text-center h-11 right-8 bottom-24 z-40">
          <button
            onClick={() => setIsInputVisible(!isInputVisible)}
            className="mt-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-6 h-6"
              fill="rgb(191, 191, 199)"
            >
              <path d="M0 216C0 149.7 53.7 96 120 96l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72zm256 0c0-66.3 53.7-120 120-120l8 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-8 0c-30.9 0-56 25.1-56 56l0 8 64 0c35.3 0 64 28.7 64 64l0 64c0 35.3-28.7 64-64 64l-64 0c-35.3 0-64-28.7-64-64l0-32 0-32 0-72z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}); }

export default ProfilPage;
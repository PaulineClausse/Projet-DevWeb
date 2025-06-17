import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

const ProfilPage = () => {
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);

  const handleClose = () => {
    setIsInputVisible(false);
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/posts/${id}`);
      getPosts();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.message);
    }
  };

  const putPost = async (id) => {
    const data = { title, content, image };
    try {
      await axios.put(`http://localhost:3000/api/posts/${id}`, data);
      getPosts();
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
    try {
      if (editingPostId) {
        putPost(editingPostId);
        setTitle("");
        setContent("");
        setImage("");
        setEditingPostId(null);
        setIsInputVisible(false);
        return;
      }
      await axios.post("http://localhost:3000/api/posts/", data);
      getPosts();
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

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/posts/");
      setPosts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:4001/api/comments/post/${postId}`);
      setComments(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setComments([]);
      } else {
        console.log(error);
      }
    }
  };

  const addComment = async (postId) => {
    if (!newComment) return alert("Le commentaire ne peut pas être vide");
    const commentData = {
      post_id: postId,
      user_id: "currentUserId",
      content: newComment,
    };
    try {
      await axios.post("http://localhost:4001/api/comments/", commentData);
      setNewComment("");
      getComments(postId);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
    }
  };

  const deleteComment = async (commentId, postId) => {
    try {
      await axios.delete(`http://localhost:4001/api/comments/${commentId}`);
      getComments(postId);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
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

  const displayComments = (postId) => {
    return comments
      .filter((comment) => comment.post_id === postId)
      .map((comment) => (
        <div
          key={comment._id}
          className="p-3 my-2 bg-gradient-to-r from-[rgba(38,38,38,0.95)] to-[rgba(119,191,199,0.15)] border-l-4 border-[rgba(119,191,199,0.7)] rounded-md shadow-sm"
        >
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <img
                src={comment.avatar || "/images/pdp_test.jpg"}
                alt="Avatar"
                className="w-7 h-7 rounded-full border-2 border-white object-cover"
              />
              <span className="text-[rgba(119,191,199,0.9)] font-semibold">
                {comment.pseudo || comment.username || "Utilisateur"}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {comment.date ? new Date(comment.date).toLocaleString("fr-FR") : ""}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-100">{comment.content}</p>
            <button
              onClick={() => deleteComment(comment._id, postId)}
              className="ml-4 text-red-400 hover:text-red-600 transition"
              title="Supprimer le commentaire"
            >
              <img src="/icons/delete.png" alt="Supprimer" className="w-5 h-5" />
            </button>
          </div>
        </div>
      ));
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col">
        <div className="relative top-20">
          <div className="shadow-2xl bg-gradient-to-r from-[#7BE9E49E] to-[#0A3C5B] text-white p-14 w-9/12 right-14 top-12 absolute rounded-lg">
            <h1 className="absolute -top-10 left-0 text-3xl font-bold text-white">
              Profil
            </h1>
            <div className="flex flex-col ">
              <div className="absolute  top-4 left-4 flex flex-row ">
                <p className="font-bold text-xl ">Pseudo</p>
                <p className="px-3 text-gray-300 text-xl ">@username</p>
              </div>
              <div>
                <p className="absolute left-4">Ceci est la biographie</p>
              </div>
            </div>
          </div>
          <img
            className=" absolute lg:w-1/12 md:w-2/12 right-1  rounded-full w-3/12  object-cover border-2 border-white"
            src="./images/pdp_test.jpg"
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
                    className=" relative mt-8 border-[2px]  border-[rgba(119,191,199,0.5)] bg-opacity-80 rounded-lg p-5 shadow-[2px_1px_8px_rgba(255,255,255,0.15)]  max-w-md mx-auto"
                  >
                    <header className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src="./images/pdp_test.jpg"
                          alt="Avatar"
                          className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between space-x-3">
                            <div>
                              <h3 className=" text-[rgba(119,191,199,0.5)] font-semibold text-lg">
                                {post.pseudo || "Pseudo"}
                              </h3>
                              <time className="text-gray-400 text-xs">
                                {new Date(post.date).toLocaleString("fr-FR")}
                              </time>
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
                                  strokeWidth="40"
                                />
                              </svg>
                            </div>
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
                          </div>
                        </div>
                      </div>
                    </header>
                    {post.title && (
                      <h2 className="text-white text-xl font-bold mb-2">
                        {post.title}
                      </h2>
                    )}
                    <p className="text-gray-200 text-base leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <section className="flex items-center justify-between text-gray-300">
                      <div className="flex space-x-6">
                        <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-200">
                          <img
                            className="w-6 h-6"
                            src="/icons/like.png"
                            alt="Like"
                          />
                          <span>Like</span>
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
                <p className="text-justify text-gray-400 text-lg font-bold  px-64 py-20">
                  You don't have any posts to view.
                </p>
              )}
            </>
          )}
        </div>
      </div>
      {isInputVisible && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
            onClick={handleClose}
          ></div>
          <div
            className="
              relative fixed bottom-8 left-1/2 transform -translate-x-1/2 
              w-5/6 max-w-md px-4 py-3 gap-4 flex flex-col 
              bg-[rgb(50,50,50)] rounded-3xl shadow-2xl z-20
              sm:flex-row sm:items-center
            "
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="./images/pdp_test.jpg"
              alt="Avatar"
              className="absolute -top-5 -left-3 w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            <input
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-6 text-2xl sm:text-4xl font-bold outline-none placeholder-gray-400 bg-transparent mb-2 sm:mb-0"
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
    </div>
  );
};

export default ProfilPage;
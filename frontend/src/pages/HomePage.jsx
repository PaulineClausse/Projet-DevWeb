import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const currentUserId = "currentUserId";
const BASE_REPLY_ROWS = 1;

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [likesUsers, setLikesUsers] = useState({});
  const [users, setUsers] = useState({});
  const [showLikesList, setShowLikesList] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [replyTarget, setReplyTarget] = useState(null);

  // Ajoute le token d'auth à chaque requête protégée
  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Récupère les infos d'un utilisateur et les met en cache
  const fetchUser = async (userId) => {
    if (!userId || users[userId]) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`http://localhost:5000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUsers((prev) => ({ ...prev, [userId]: res.data.user }));
    } catch (e) {
      setUsers((prev) => ({ ...prev, [userId]: { username: "Utilisateur" } }));
    }
  };

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/posts/", {
        headers: getAuthHeaders(),
      });
      setPosts(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getComments = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/api/comments/post/${postId}`,
        { headers: getAuthHeaders() }
      );
      setComments((prev) => ({
        ...prev,
        [postId]: response.data,
      }));
      // Récupère les utilisateurs pour chaque commentaire
      response.data.forEach((comment) => fetchUser(comment.user_id));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setComments((prev) => ({
          ...prev,
          [postId]: [],
        }));
      } else {
        console.log("Erreur lors de la récupération des commentaires:", error);
      }
    }
  };

  // Récupère le nombre de likes et la liste des users ayant liké
  const getLikes = async (postId) => {
    try {
      // Récupère la liste des user_id ayant liké
      const response = await axios.get(
        `http://localhost:4002/api/likes/${postId}/users`,
        { headers: getAuthHeaders() }
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
      user_id: currentUserId,
      content: newComment,
    };
    try {
      await axios.post("http://localhost:4001/api/comments/", commentData, {
        headers: getAuthHeaders(),
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
          user_id: currentUserId,
          content: replyTarget.value,
        },
        { headers: getAuthHeaders() }
      );
      setReplyTarget(null);
      getComments(postId);
    } catch (error) {
      console.error("Erreur lors de la réponse :", error);
    }
  };

  const putPost = async (id, data) => {
    try {
      await axios.put(`http://localhost:3000/api/posts/${id}`, data, {
        headers: getAuthHeaders(),
      });
      getPosts();
      setIsInputVisible(false);
      setTitle("");
      setContent("");
      setImage("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post :", error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/posts/${id}`, {
        headers: getAuthHeaders(),
      });
      getPosts();
    } catch (error) {
      console.error("Erreur lors de la suppression du post :", error.message);
    }
  };

  const deleteComment = async (commentId, postId, parentId = null) => {
    try {
      if (parentId) {
        await axios.delete(
          `http://localhost:4001/api/comments/${parentId}/reply/${commentId}`,
          { headers: getAuthHeaders() }
        );
      } else {
        await axios.delete(
          `http://localhost:4001/api/comments/${commentId}`,
          { headers: getAuthHeaders() }
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
          user_id: currentUserId,
        },
        { headers: getAuthHeaders() }
      );
      getLikes(postId);
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setImage(post.image);
    setIsInputVisible(true);
  };

  const handleClick = async () => {
    const data = { title, content, image };
    if (!title || !content) {
      return alert("Title and content are required");
    }
    try {
      if (editingPostId) {
        await putPost(editingPostId, data);
        setEditingPostId(null);
        return;
      }
      await axios.post("http://localhost:3000/api/posts/", data, {
        headers: getAuthHeaders(),
      });
      getPosts();
      setIsInputVisible(false);
      setTitle("");
      setContent("");
      setImage("");
    } catch (error) {
      console.error("Erreur lors de la création :", error.message);
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
              src={users[comment.user_id]?.image || "/images/pdp_test.jpg"}
              alt="Avatar"
              className={`rounded-full border-2 border-white object-cover ${level === 0 ? "w-7 h-7" : "w-5 h-5"}`}
            />
            <span className={`font-semibold ${level === 0 ? "text-[rgba(119,191,199,0.9)]" : "text-cyan-300 text-sm"}`}>
              {users[comment.user_id]?.username || "Utilisateur"}
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

  useEffect(() => {
    // Redirige si non authentifié
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/auth";
    } else {
      getPosts();
    }
  }, []);

  useEffect(() => {
    posts.forEach((post) => getLikes(post._id));
  }, [posts]);

  return (
    <div className="min-h-screen flex flex-col mx-auto px-4 gap-5">
      <Navbar />
      <div className="mt-16 md:mt-4 md:flex flex-col items-center">
        <div id="Message" className="h-16">
          <section className="text-white text-xl font-bold">Messages</section>
        </div>
        <div className="flex justify-center items-center gap-4 mb-2">
          <img
            src="./images/pdp_test.jpg"
            alt="Profil 1"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <img
            src="./images/pdp_test.jpg"
            alt="Profil 2"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <img
            src="./images/pdp_test.jpg"
            alt="Profil 3"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
        </div>
        <div className="flex-grow pb-32 px-4 py-9">
          {isloading ? (
            "Loading..."
          ) : (
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="relative mt-8 border-[2px] border-[rgba(119,191,199,0.5)] bg-opacity-80 rounded-lg p-5 shadow-[2px_1px_8px_rgba(255,255,255,0.15)] max-w-md mx-auto"
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
                              <h3 className="text-[rgba(119,191,199,0.5)] font-semibold text-lg">
                                {post.pseudo || "Pseudo"}
                              </h3>
                              <time className="text-gray-400 text-xs">
                                {new Date(post.date).toLocaleString("fr-FR")}
                              </time>
                            </div>
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                fill="rgb(38, 38, 38)"
                                className="w-6 h-6 cursor-pointer"
                                onClick={handleEditClick.bind(null, post)}
                                title="Modifier le post"
                              >
                                <path
                                  d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                                  stroke="rgb(191, 191, 199)"
                                  strokeWidth="40"
                                />
                              </svg>
                              <svg
                                onClick={() => deletePost(post._id)}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                fill="rgb(38, 38, 38)"
                                className="w-5 h-6 ml-2 cursor-pointer"
                                title="Supprimer le post"
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
                <p className="text-justify text-gray-400 text-lg font-bold md:left-72">
                  You don't have any posts to view.
                </p>
              )}
            </>
          )}
        </div>
        {/* FORMULAIRE AJOUT POST STYLE BASE */}
        {isInputVisible && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
              onClick={() => setIsInputVisible(false)}
            ></div>
            <div
              className="
                relative bottom-8 left-1/2 transform -translate-x-1/2 
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
                  className="ml-3 p-2 md:px-6 hover:bg-white/20 rounded-full transition flex-shrink-0"
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
        {/* BOUTON AJOUT POST STYLE BASE */}
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
  );
};

export default HomePage;
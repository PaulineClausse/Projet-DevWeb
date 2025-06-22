import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import CommentWithRepliesView from "../components/CommentWithRepliesView";

import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [setUserPost] = useState("");
  const [image, setImage] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [user, setUser] = useState({});
  const selfId = user?.user_id;
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [replyTarget, setReplyTarget] = useState(null);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [likesUsers, setLikesUsers] = useState({});
  const [users, setUsers] = useState({});
  const [showLikesList, setShowLikesList] = useState(null);

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

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/posts/", {
        withCredentials: true,
      });

      console.log(response.data);
      setPosts(response.data);
      const post = response.data;
      const postsWithUsernames = await Promise.all(
        post.map(async (post) => {
          try {
            const userResponse = await axios.get(
              `http://localhost:5000/user/${post.userId}`,
              {
                withCredentials: true,
              }
            );
            const username = userResponse.data.user.username;
            const imageUser = userResponse.data.user.image;
            return { ...post, username, imageUser };
          } catch (error) {
            console.error(`Erreur pour l'user ${post.userId} :`, error.message);
            return { ...post, username: "Utilisateur inconnu" };
          }
        })
      );
      setPosts(postsWithUsernames);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setIsInputVisible(false);
  };

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
        console.log("Erreur lors de la récupération des commentaires:", error);
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
        await axios.delete(`http://localhost:4001/api/comments/${commentId}`, {
          withCredentials: true,
        });
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
        {
          withCredentials: true,
        }
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

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setImage(post.image);
    setIsInputVisible(true);
  };
  const handleClick = async () => {
    const data = {
      title,
      content,
      image,
      userId: user.user_id,
    };

    if (!title || !content) {
      return alert("Title and content are required");
    }

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
      const res = await axios.post(
        "http://localhost:3000/api/posts/create",

        data,
        { withCredentials: true }
      );
      console.log("Résultat de la requête POST :", res);
      getPosts();
      setIsInputVisible(false);
      setTitle("");
      setContent("");
      setImage("");
      setUserPost("");
    } catch (error) {
      console.error("Erreur lors de la création :", error.message);
    }
  };
  const deletePost = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/posts/delete/${id}`,
        { withCredentials: true }
      );
      console.log("Résultat de la requête DELETE :", res);
      getPosts();
    } catch (error) {
      console.error("Erreur lors de la suppression du post :", error.message);
    }
  };

  const putPost = async (id) => {
    const data = {
      title,
      content,
      image,
      userId: user.user_id,
    };
    try {
      const res = await axios.put(
        `http://localhost:3000/api/posts/modify/${id}`,
        data,
        { withCredentials: true }
      );
      console.log("Données envoyées dans le PUT :", data);
      console.log("Résultat de la requête PUT :", res);
      getPosts();
      setIsInputVisible(false);
      setTitle("");
      setContent("");
      setImage("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error.message);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth", {
        withCredentials: true,
      });
      console.log("Utilisateur connecté :", response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.log("Pas connecté", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (user.user_id) {
      getPosts();
    }
  }, [user]);

  const getReplies = (comment, allComments) => {
    return allComments.filter((c) => c.parent_id === comment._id);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth", { withCredentials: true })
      .then(() => getPosts())
      .catch(() => (window.location.href = "/auth"));
  }, []);

  useEffect(() => {
    posts.forEach((post) => {
      fetchUser(post.user_id);
      getLikes(post._id);
    });
  }, [posts]);

  return (
    <div
      id=""
      className="min-h-screen bg-gradient-to-tr from-[#5e5d5d9e] to-[#0a525b] flex flex-col mx-auto px-4 gap-5 "
    >
      <Navbar />
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
      <div className="mt-16 md:mt-4 md:flex flex-col items-center">
        <div id="Message" className="h-16 ">
          <section className="text-white text-xl font-bold fonts md:mt-">
            Messages
          </section>
          <div className="flex gap-2 py-3 ">
            <img
              src="./images/pdp_test.jpg"
              alt="Avatar"
              className="w-12 h-12 rounded-full shadow-2xl border-2 border-white object-cover"
            />
            <img
              src="./images/pdp_test.jpg"
              alt="Avatar"
              className="w-12 h-12 rounded-full  shadow-2xl border-2 border-white object-cover"
            />
            <img
              src="./images/pdp_test.jpg"
              alt="Avatar"
              className="w-12 h-12 rounded-full  shadow-2xl border-2 border-white object-cover"
            />
          </div>
        </div>

        <div className=" flex-grow  pb-32 px-4 py-9">
          <section className="text-white text-xl font-bold fonts">Feed</section>
          {isloading ? (
            "Loading..."
          ) : (
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className=" relative mt-8 border-[2px] bg-[rgba(38,38,38,0.5)] border-[rgba(119,191,199,0.5)] bg-opacity-80 rounded-lg p-5 shadow-[2px_1px_8px_rgba(255,255,255,0.15)]  max-w-md mx-auto"
                  >
                    <header className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => navigate("/profil/" + post.userId)}
                        >
                          <img
                            src={
                              post?.imageUser
                                ? `http://localhost:5000/uploads/${post.imageUser}`
                                : "../public/images/pdp_basique.jpeg"
                            }
                            alt="Avatar"
                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                          />
                        </button>
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between space-x-3">
                            <div>
                              <h3 className=" text-[rgba(119,191,199,0.5)] font-semibold text-lg">
                                {post.username || "Pseudo"}
                              </h3>
                              <time className="text-gray-400 text-xs">
                                {new Date(post.date).toLocaleString("fr-FR")}
                              </time>
                              {selfId === post.userId && (
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
                            {selfId === post.userId && (
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  fill="rgb(38, 38, 38)"
                                  className="w-6 h-6 cursor-pointer"
                                  onClick={() => handleEditClick(post)}
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
                                  className="absolute top-3 right-3 w-5 h-6   cursor-pointer"
                                >
                                  <path
                                    d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                                    stroke="rgb(191, 191, 199)"
                                    stroke-width="40"
                                  />
                                </svg>
                              </div>
                            )}
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
                    {showLikesList === post._id && (
                      <div className="absolute bg-gray-800 text-white rounded p-2 z-50 mt-2 left-0 right-0 max-w-xs mx-auto">
                        <h4 className="font-bold mb-2">Likes</h4>
                        <ul>
                          {(likesUsers[post._id] || []).map((userId) => (
                            <li
                              key={userId}
                              className="flex items-center gap-2 mb-1"
                            >
                              <img
                                src={
                                  users[userId]?.image || "/images/pdp_test.jpg"
                                }
                                alt="Avatar"
                                className="w-6 h-6 rounded-full border"
                              />
                              <span>
                                {users[userId]?.username || "Utilisateur"}
                              </span>
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
                        <div className="pt-4">
                          {(comments[post._id] || [])
                            .filter((c) => !c.parent_id)
                            .map((comment) => (
                              <CommentWithRepliesView
                                key={comment._id}
                                comment={comment}
                                postId={post._id}
                                allComments={comments[post._id] || []}
                                replyTarget={replyTarget}
                                setReplyTarget={setReplyTarget}
                                addReply={addReply}
                                deleteComment={deleteComment}
                                getReplies={getReplies}
                              />
                            ))}
                        </div>
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
                <p className=" text-gray-400 text-lg font-bold">
                  {" "}
                  You don't have any posts to view.
                </p>
              )}
            </>
          )}
        </div>
        {isInputVisible && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
              onClick={handleClose}
            ></div>

            <div
              className="
               md:left-64
    relative bottom-24 left-1/2 transform -translate-x-1/2 
    w-5/6 max-w-md px-4 py-3 gap-4 flex flex-col 
    bg-[rgb(50,50,50)] rounded-3xl shadow-2xl z-20
    sm:flex-row sm:items-center
  "
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={
                  user?.image
                    ? `http://localhost:5000/uploads/${user.image}`
                    : "../public/images/pdp_basique.jpeg"
                }
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
                  maxLength={280}
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
        <div className=" fixed shadow-lg border border-gray-600  bg-black/30 rounded-full w-11 text-center h-11 right-8 bottom-24">
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

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
  const [activeTab, setActiveTab] = useState("forYou");
  const [following, setFollowing] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fetchUser = async (userId) => {
    if (!userId || users[userId]) return;
    try {
      const res = await axios.get(`https://zing.com/auth/user/${userId}`, {
        withCredentials: true,
      });
      setUsers((prev) => ({ ...prev, [userId]: res.data.user }));
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setUsers((prev) => ({ ...prev, [userId]: { username: "Utilisateur" } }));
    }
  };

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://zing.com/posts/", {
        withCredentials: true,
      });

      console.log(response.data);
      setPosts(response.data);
      const post = response.data;
      const postsWithUsernames = await Promise.all(
        post.map(async (post) => {
          try {
            const userResponse = await axios.get(
              `https://zing.com/auth/user/${post.userId}`,
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
        `https://zing.com/comments/post/${postId}`,
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
        `https://zing.com/likes/${postId}/users`,
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
      // eslint-disable-next-line no-unused-vars
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
      await axios.post("https://zing.com/comments/", commentData, {
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
        `https://zing.com/comments/${commentId}/reply`,
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
          `https://zing.com/comments/${parentId}/reply/${commentId}`,
          { withCredentials: true }
        );
      } else {
        await axios.delete(`https://zing.com/comments/${commentId}`, {
          withCredentials: true,
        });
      }
      getComments(postId);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
    }
  };

  const toggleLike = async (postId, post_user_id) => {
    try {
      const res = await axios.post(
        "https://zing.com/likes/",
        {
          post_id: postId,
        },
        {
          withCredentials: true,
        }
      );
      getLikes(postId);
      if (res.data.message === "Post liké") {
        postNotification({ userId: post_user_id, type: "like" });
      }
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  };

  const toggleComments = async (postId, post_user_id) => {
    if (activePostId === postId) {
      setActivePostId(null);
    } else {
      setActivePostId(postId);
      getComments(postId);
      postNotification({ userId: post_user_id, type: "comment" });
    }
  };

  const isVideo = (fileOrUrl) => {
    if (fileOrUrl instanceof File) {
      return fileOrUrl.type.startsWith("video/");
    } else if (typeof fileOrUrl === "string") {
      return fileOrUrl.match(/\.(mp4|webm|ogg)$/i);
    }
    return false;
  };
  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setImage(post.image);
    {
      post.image && setImagePreview(`https://zing.com/uploads/${post.image}`);
    }

    setIsInputVisible(true);
  };
  const handleClick = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", user.user_id);
    if (image) {
      formData.append("image", image);
    }

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

      const res = await axios.post("https://zing.com/posts/create", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Résultat de la requête POST :", res);
      getPosts();
      setIsInputVisible(false);
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setUserPost("");
    } catch (error) {
      console.error("Erreur lors de la création :", error.message);
    }
  };

  const getFollowing = async () => {
    try {
      const response = await axios.get(
        `https://zing.com/followers/followers/following/${user.user_id}`
      );
      const rawFollowing = response.data;

      const detailedFollowing = await Promise.all(
        rawFollowing.map(async (f) => {
          const res = await axios.get(
            `https://zing.com/auth/user/${f.followingId}`,
            {
              withCredentials: true,
            }
          );
          return res.data.user;
        })
      );

      setFollowing(detailedFollowing);
      console.log("Utilisateurs suivis :", detailedFollowing);
    } catch (error) {
      console.error("Erreur lors du chargement des followers :", error);
    }
  };

  const postNotification = async ({ userId, type }) => {
    try {
      const userInfo = await getUserInfo({ id: userId });

      if (!userInfo) return;

      let data;

      if (type === "like") {
        data = {
          userId: userId,
          type: type,
          message: `${user.username} a liké votre post`,
        };
        console.log(data);
      } else if (type === "comment") {
        data = {
          userId: userId,
          type: type,
          message: `${user.username} a commenté votre post`,
        };
      } else {
        data = {
          userId: userId,
          type: type,
          message: `${user.username} a fait une action`,
        };
      }

      const res = await axios.post(`https://zing.com/notification/`, data, {
        withCredentials: true,
      });

      console.log("Résultat de la requête POST :", res);
    } catch (error) {
      console.error("Erreur lors de la notification du post :", error.message);
    }
  };

  const getUserInfo = async ({ id }) => {
    try {
      const response = await axios.get(`https://zing.com/auth/user/${id}`, {
        withCredentials: true,
      });
      return response.data.user;
    } catch (error) {
      console.log("Pas d'utilisateur", error);
      return null;
    }
  };

  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`https://zing.com/posts/delete/${id}`, {
        withCredentials: true,
      });
      console.log("Résultat de la requête DELETE :", res);
      getPosts();
    } catch (error) {
      console.error("Erreur lors de la suppression du post :", error.message);
    }
  };

  const putPost = async (id) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", user.user_id);
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("deleteImage", true);
    }
    try {
      const res = await axios.put(
        `https://zing.com/posts/modify/${id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Données envoyées dans le PUT :", formData);
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
      const response = await axios.get("https://zing.com/auth/auth", {
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
      getFollowing();
      getPosts();
    }
  }, [user]);

  const getReplies = (comment, allComments) => {
    return allComments.filter((c) => c.parent_id === comment._id);
  };

  useEffect(() => {
    axios
      .get("https://zing.com/auth/auth", { withCredentials: true })
      .then(() => getPosts())
      .catch(() => (window.location.href = "/authentication"));
  }, []);

  useEffect(() => {
    posts.forEach((post) => {
      fetchUser(post.user_id);
      getLikes(post._id);
    });
  }, [posts]);

  const VerifyUser = async (PostUserID) => {
    const response = await axios.get(
      `https://zing.com/auth/user/${PostUserID}`,
      {
        withCredentials: true,
      }
    );

    if (response.data.user) {
      navigate("/profil/" + PostUserID);
    } else {
      alert("Utilisateur supprimé !");
    }
  };

  return (
    <div id="" className="min-h-screen  flex flex-col mx-auto px-4 gap-5 ">
      <Navbar />

      <div className="fixed inset-0 backdrop-blur-md z-0" />
      <div className="mt-16 md:mt-4 md:flex flex-col items-center z-10">
        <div className=" flex-grow  pb-32 px-4 py-9">
          <div className="flex transition duration-200 ease-in-out transform hover:scale-105 gap-4">
            <button
              onClick={() => setActiveTab("forYou")}
              className={`font-bold w-32 rounded-lg text-white border-[2px] transition-all duration-200
      ${
        activeTab === "forYou"
          ? "bg-[rgb(55,134,148)] border-[rgba(119,191,199,0.5)]"
          : "bg-[rgba(38,38,38,0.5)] border-transparent hover:bg-[rgb(55,134,148)] hover:border-[rgba(119,191,199,0.5)]"
      }`}
            >
              For You
            </button>

            <button
              onClick={() => setActiveTab("following")}
              className={`font-bold w-32 rounded-lg text-white border-[2px] transition-all duration-200
      ${
        activeTab === "following"
          ? "bg-[rgb(55,134,148)] border-[rgba(119,191,199,0.5)]"
          : "bg-[rgba(38,38,38,0.5)] border-transparent hover:bg-[rgb(55,134,148)] hover:border-[rgba(119,191,199,0.5)]"
      }`}
            >
              Following
            </button>
          </div>

          {isloading ? (
            "Loading..."
          ) : (
            <>
              {posts.length > 0 ? (
                (activeTab === "forYou"
                  ? posts
                  : posts.filter((post) =>
                      following.some(
                        (user) => String(user.user_id) === String(post.userId)
                      )
                    )
                ).map((post) => (
                  <div
                    key={post._id}
                    className=" relative opacity-0 translate-y-4 animate-fadeInUp delay-10 transition duration-200 ease-in-out transform hover:scale-105 hover:bg-[rgb(55,134,148)] mt-8 border-[2px] bg-[rgba(38,38,38,0.5)] border-[rgba(119,191,199,0.5)] bg-opacity-80 rounded-lg p-5 shadow-[2px_1px_8px_rgba(255,255,255,0.15)]  max-w-md mx-auto"
                  >
                    <header className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => VerifyUser(post.userId)}
                          // onClick={() => navigate("/profil/" + post.userId)}
                        >
                          <img
                            src={
                              post?.imageUser
                                ? `https://zing.com/auth/uploads/${post.imageUser}`
                                : "../public/images/pdp_basique.jpeg"
                            }
                            alt="Avatar"
                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                          />
                        </button>
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between space-x-3">
                            <div>
                              <h3 className=" text-[#7ddce6] font-semibold text-lg">
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
                              <div>
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

                    {post.image &&
                      post.image.trim() !== "" &&
                      !post.image.trim().toLowerCase().endsWith("undefined") &&
                      (post.image.endsWith(".mp4") ? (
                        <video
                          controls
                          className="max-w-full max-h-80 rounded-lg mb-4 object-contain"
                        >
                          <source
                            src={`https://zing.com/uploads/${post.image}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={`https://zing.com/uploads/${post.image}`}
                          alt="Post"
                          className="max-w-full max-h-80 rounded-lg mb-4 object-contain"
                        />
                      ))}
                    <section className="flex items-center justify-between text-gray-300">
                      <div className="flex space-x-6">
                        <button
                          className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-200"
                          onClick={() => toggleLike(post._id, post.userId)}
                        >
                          <img
                            className="w-6 h-6"
                            src="/icons/like.png"
                            alt="Like"
                          />

                          <span
                            className="ml-2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowLikesList(
                                showLikesList === post._id ? null : post._id
                              );
                            }}
                          >
                            {likes[post._id] || 0}
                          </span>
                        </button>
                        <button
                          onClick={() => toggleComments(post._id, post.userId)}
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
                      <div className="fixed bg-gray-800 bg-opacity-95 text-white rounded p-4 z-[999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xs w-full shadow-xl">
                        <h4 className="font-bold mb-2">Likes</h4>
                        <ul>
                          {(likesUsers[post._id] || []).map((userId) => (
                            <li
                              key={userId}
                              className="flex items-center gap-2 mb-1"
                            >
                              <img
                                src={
                                  user?.image
                                    ? `https://zing.com/auth/uploads/${user.image}`
                                    : "../public/images/pdp_basique.jpeg"
                                }
                                alt="Avatar"
                                className="w-6 h-6 rounded-full border"
                              />
                              <span>
                                {users[userId]?.username ||
                                  "Utilisateur inconnu"}
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
        md:left-64 relative bottom-24 left-1/2 transform -translate-x-1/2 
        w-5/6 max-w-md px-4 py-3 gap-4 flex flex-col 
        bg-[rgb(50,50,50)] rounded-3xl shadow-2xl z-20
        sm:flex-row sm:items-center
      "
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={
                  user?.image
                    ? `https://zing.com/auth/uploads/${user.image}`
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

              <div className="flex flex-col w-full gap-2">
                <div className="flex items-center bg-black/10 backdrop-blur-sm rounded-3xl px-4 py-3">
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

                  <label className="relative ml-2 cursor-pointer flex w-6 h-6 flex-shrink-0">
                    <img
                      src="/images/image.png"
                      alt="Add"
                      className="w-5 h-5 opacity-70 hover:opacity-100 transition duration-200 brightness-0 invert"
                    />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImage(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                        // else {
                        //   alert("Please select an image or video file.");
                        // }
                      }}
                    />
                  </label>
                  <button
                    className="ml-3 p-2 md:px-6 hover:bg-white/20 rounded-full transition flex-shrink-0"
                    onClick={handleClick}
                  >
                    <img
                      className="w-6 h-6"
                      src="/icons/publish.png"
                      alt="Publish"
                    />
                  </button>
                </div>

                {/* Prévisualisation de l'image */}
                {imagePreview && (
                  <div className="relative w-fit">
                    {isVideo(image) ? (
                      <video
                        src={imagePreview}
                        controls
                        className="max-h-48 rounded-lg mt-2"
                      />
                    ) : (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 rounded-lg mt-2"
                      />
                    )}
                    <button
                      className="absolute top-0 right-0 bg-black/60 text-white p-1 rounded-full"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <div className=" fixed shadow-lg border transition duration-200 ease-in-out transform hover:scale-105 hover:bg-[rgb(70,180,190)] border-gray-600  bg-black/30 rounded-full w-11 text-center h-11 right-8 bottom-24">
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

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userPost, setUserPost] = useState("");
  const [image, setImage] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [user, setUser] = useState({});

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/posts/");

      console.log(response.data);
      setPosts(response.data);
      const post = response.data;
      const postsWithUsernames = await Promise.all(
        post.map(async (post) => {
          try {
            const userResponse = await axios.get(
              `http://localhost:5000/user/${post.userId}`
            );
            const username = userResponse.data.user.username;
            return { ...post, username };
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
      const res = await axios.post("http://localhost:3000/api/posts/", data);
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
      const res = await axios.delete(`http://localhost:3000/api/posts/${id}`);
      console.log("Résultat de la requête DELETE :", res);
      getPosts();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.message);
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
        `http://localhost:3000/api/posts/${id}`,
        data
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
  return (
    <div id="" className="min-h-screen  flex flex-col mx-auto px-4 gap-5 ">
      <Navbar />
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
                    className=" relative mt-8 border-[2px] border-[rgba(119,191,199,0.5)] bg-opacity-80 rounded-lg p-5 shadow-[2px_1px_8px_rgba(255,255,255,0.15)]  max-w-md mx-auto"
                  >
                    {/* En-tête : avatar + pseudo + date */}
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
                                {post.username || "Pseudo"}
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
                                  stroke-width="40"
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
                                stroke-width="40"
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

                        <button className="flex items-center space-x-1 hover:text-green-400 transition-colors duration-200">
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
              md:top-96 md:left-64
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

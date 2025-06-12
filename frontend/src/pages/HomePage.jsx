import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/posts/");
      console.log(response.data);
      setPosts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);

  const handleClose = () => {
    setIsInputVisible(false); // ou autre logique pour "débloquer" le fond
  };

  return (
    <div id="" className="min-h-screen flex flex-col mx-auto px-4 gap-5 ">
      <Header />
      <div id="Message" className="h-16 ">
        <section className="text-white text-xl font-bold fonts">
          Messages
        </section>
        <section></section>
      </div>

      <div className=" flex-grow px-4 py-2">
        <section className="text-white text-xl font-bold fonts">Feed</section>
        {isloading ? (
          "Loading..."
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="relative mt-8 border px-3  rounded-[3vw] shadow-[2px_1px_20px_rgba(0,0,0,0.3)] shadow-[rgb(100,98,98)]"
                >
                  <img
                    src="./images/pdp_test.jpg"
                    alt="Avatar"
                    className="absolute -top-5 -left-5 w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  <section className="text-white text-right">Pseudo</section>
                  <section className="text-white text-sm">
                    {post.content}
                  </section>
                  <section className="flex justify-between mt-1">
                    <div>
                      <button className="text-white">
                        <img
                          className="w-5 sm:w-7"
                          src="/icons/like.png"
                          alt=""
                        />
                      </button>

                      <button className=" px-3">
                        <img
                          className="w-5 sm:w-7"
                          src="/icons/comment.png"
                          alt=""
                        />
                      </button>

                      <button>
                        <img
                          className="w-5 sm:w-7"
                          src="/icons/share.png"
                          alt=""
                        />
                      </button>
                    </div>
                    <div className="text-white text-xs">{post.date}</div>
                  </section>
                </div>
              ))
            ) : (
              <p>No posts found</p>
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
            className="relative fixed bottom-28 left-1/2 transform -translate-x-1/2 w-5/6 px-4 py-3 gap-2 flex items-center bg-[rgb(50,50,50)] rounded-3xl shadow-2xl z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="./images/pdp_test.jpg"
              alt="Avatar"
              className="absolute -top-5 -left-5 w-12 h-12 rounded-full border-2 border-white object-cover"
            />

            <input
              type="text"
              placeholder="Écris quelque chose..."
              autoFocus
              className="flex-1 px-4 py-3 rounded-3xl text-white placeholder-gray-400 outline-none bg-transparent"
            />
            <button className="ml-3">
              <img
                className="w-5 sm:w-7"
                src="/icons/publish.png"
                alt="Publish icon"
              />
            </button>
          </div>
        </>
      )}

      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-8 bg-[rgb(38,38,38)] p-4 rounded-2xl shadow-lg">
        <button
          onClick={() => setIsInputVisible(!isInputVisible)}
          className="mt-3"
        >
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            fill="white"
          >
            <path d="M224 256c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32s-32 14.3-32 32v128c0 17.7 14.3 32 32 32zm0 64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64c0-17.7-14.3-32-32-32z" />
          </svg>
        </button>
        <button className="mt-3 ">
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 576 512"
            fill="rgb(38, 38, 38)"
          >
            <path
              d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"
              stroke="rgb(191, 191, 199)"
              stroke-width="40"
            />
          </svg>
        </button>

        <button className="mt-3 ">
          <svg
            className="w-7 h-7"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 448 512"
            fill="rgb(191, 191, 198)"
          >
            <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416l400 0c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4l0-25.4c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112l0 25.4c0 47.9 13.9 94.6 39.7 134.6L72.3 368C98.1 328 112 281.3 112 233.4l0-25.4c0-61.9 50.1-112 112-112zm64 352l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
          </svg>
        </button>

        <button className="mt-3 ">
          <svg
            className="w-7 h-6"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="22.5"
            viewBox="0 0 512 512"
            fill="rgb(38, 38, 38)"
          >
            <path
              d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
              stroke="rgb(191, 191, 199)"
              stroke-width="40"
            />
          </svg>
        </button>
      </div>

      {/* <div className="md:flex text-red-600">
        {isloading ? (
          "Loading..."
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id}>
                  <h1>{post.title}</h1>
                  <p>{post.content}</p>
                </div>
              ))
            ) : (
              <p>No posts found</p>
            )}
          </>
        )}
      </div> */}
    </div>
  );
};

export default HomePage;

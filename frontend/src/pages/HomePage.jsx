import { useEffect, useState } from "react";
import axios from "axios";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3000/api/tasks/");
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

  return (
    <div>
      <div className="mt-5">
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
      </div>
    </div>
  );
};

export default HomePage;

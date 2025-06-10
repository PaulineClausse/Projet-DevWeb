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
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <h1>This is Home Page</h1>
    </div>
  );
};

export default HomePage;

import { useEffect, useState } from "react";
import API from "../../../utils/api";
import { getUser } from "../../../utils/auth";
import { FaHeart, FaComment, FaPlus } from "react-icons/fa"; 
import { format } from "date-fns";

const Posts = () => {
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const user = getUser();

  // Fetch all posts 
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/posts`); 
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle Like Button Click
  const handleLike = async (postId) => {
    try {
      await API.post(`posts/${postId}/like`);
      setPosts(posts.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      ));
    } catch (error) {
      alert("Error liking post");
    }
  };

  // Handle Create Post Submission
  const handleCreatePost = async () => {
    try {
      const { data } = await API.post(
        "/posts",
        newPost
      );
      setPosts([data, ...posts]); 
      setNewPost({ title: "", content: "" }); 
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp);
    return format(date, "yyyy-MM-dd HH:mm"); // Format as "YYYY-MM-DD HH:mm"
  };

  return (
    <div className="flex justify-center bg-black min-h-screen p-6 mt-300 overflow-y-auto w-screen">
      <div className="w-full max-w-screen-lg mx-auto">
        {/* Create Post Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center mb-4 hover:bg-blue-600 mt-150"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Create Post
        </button>

        {/* Create Post Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-900 text-white p-6 rounded-lg w-96">
              <h2 className="text-lg font-bold mb-4">Create a Post</h2>
              <input
                type="text"
                className="w-full p-2 mb-2 bg-gray-800 rounded text-white"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <textarea
                className="w-full p-2 mb-2 bg-gray-800 rounded text-white"
                placeholder="Content"
                rows="4"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              ></textarea>
              <div className="flex justify-between">
                <button
                  className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                  onClick={handleCreatePost}
                >
                  Post
                </button>
                <button
                  className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && <p className="text-center text-gray-400">Loading posts...</p>}

        {!loading && posts.length === 0 && <p className="text-center text-gray-400">No posts available.</p>}

        {posts.map((post) => (
          <div style={{ backgroundColor: "#222" }}
            key={post.id} 
            className="bg-gray-900 text-white shadow-md p-8 mb-6 border border-gray-800 w-full min-h-[200px] rounded-lg"
          >
            {/* User Info */}
            <div className="flex items-center mb-2">
              <p className="font-semibold">{post.username}</p>
              <p className="text-xs text-gray-400 ml-2">{formatDate(post.created_at) || "Just now"}</p>
            </div>

            {/* Post Content */}
            <h2 className="text-lg font-bold">{post.title}</h2>
            <p className="text-gray-300">{post.content}</p>

            {/* Engagement Section */}
            <div className="flex items-center mt-4 text-gray-400">
              <button
                className={`flex items-center mr-4 ${post.liked ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
                onClick={() => handleLike(post.id)}
              >
                <FaHeart className="mr-1" />
                {post.likes || 0}
              </button>

              <button className="flex items-center mr-4 hover:text-blue-400">
                <FaComment className="mr-1" />
                {post.comments || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;

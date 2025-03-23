import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../components/AuthContext";
import { FaHeart, FaComment, FaPlus } from "react-icons/fa";
import { format } from "date-fns";
import "./Posts.css";

const ForumPosts = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [forumPosts, setForumPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isForumModalOpen, setIsForumModalOpen] = useState(false);
  const [newForumPost, setNewForumPost] = useState({ title: "", content: "" });
  const [commentInputs, setCommentInputs] = useState({}); // Track comment input per post
  const [showComments, setShowComments] = useState({}); // Track visibility of comments per post

  const fetchForumPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/posts");
      const data = await response.json();
      setForumPosts(data);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForumPosts();
  }, []);

  const handleForumLike = async (postId) => {
    if (!isLoggedIn) {
      alert("Please login to like forum posts.");
      return;
    }
    try {
      await fetch(`http://localhost:5000/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchForumPosts();
    } catch (error) {
      alert("Error liking forum post", error);
    }
  };

  const handleCreateForumPost = async () => {
    if (!isLoggedIn) {
      alert("Please login to create forum posts.");
      return;
    }
    try {
      await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newForumPost),
      });
      setNewForumPost({ title: "", content: "" });
      setIsForumModalOpen(false);
      fetchForumPosts();
    } catch (error) {
      console.error("Error creating forum post:", error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId];
    if (!content || !isLoggedIn) return;

    try {
      await fetch(`http://localhost:5000/api/posts/${postId}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content }),
      });

      setCommentInputs({ ...commentInputs, [postId]: "" });
      fetchForumPosts();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp);
    return format(date, "yyyy-MM-dd HH:mm");
  };

  // Toggle comments visibility for a specific post
  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle visibility
    }));
  };

  return (
    <div className="forum-container">
      <div className="forum-wrapper">
        {isLoggedIn && (
          <>
            <div className="forum-create-btn-container">
              <button className="forum-create-btn" onClick={() => setIsForumModalOpen(true)}>
                <FaPlus className="forum-icon" /> Create Forum Post
              </button>
            </div>
            <p className="forum-logged-in-text">
              Logged in as: <span className="forum-bold">{user?.username}</span>
            </p>
          </>
        )}

        {isForumModalOpen && (
          <div className="forum-modal-backdrop">
            <div className="forum-modal-box">
              <h2 className="forum-modal-title">Create a Forum Post</h2>
              <input
                type="text"
                className="forum-input-field"
                placeholder="Title"
                value={newForumPost.title}
                onChange={(e) =>
                  setNewForumPost({ ...newForumPost, title: e.target.value })
                }
              />
              <textarea
                className="forum-input-field"
                placeholder="Content"
                rows="4"
                value={newForumPost.content}
                onChange={(e) =>
                  setNewForumPost({ ...newForumPost, content: e.target.value })
                }
              ></textarea>
              <div className="forum-modal-actions">
                <button className="forum-modal-post" onClick={handleCreateForumPost}>
                  Post
                </button>
                <button className="forum-modal-cancel" onClick={() => setIsForumModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && <p className="forum-loading">Loading forum posts...</p>}
        {!loading && forumPosts.length === 0 && (
          <p className="forum-no-posts">No forum posts available.</p>
        )}

        {forumPosts.map((post) => (
          <div key={post.id} className="forum-card">
            <div className="forum-header">
              <p className="forum-username">{post.username}</p>
              <p className="forum-date">{formatDate(post.created_at)}</p>
            </div>
            <h2 className="forum-title">{post.title}</h2>
            <p className="forum-content">{post.content}</p>

            <div className="forum-actions">
              <button
                className="forum-like-btn"
                onClick={() => handleForumLike(post.id)}
              >
                <FaHeart className="forum-icon" />
                {post.likes || 0}
              </button>

              <button
                className="forum-comment-btn"
                onClick={() => toggleComments(post.id)} // Toggle comments visibility
              >
                <FaComment className="forum-icon" />
                {post.comments?.length || 0}
              </button>
            </div>

            {/* 💬 Comments Display (only shown if showComments[post.id] is true) */}
            {showComments[post.id] && (
              <div className="forum-comments">
                {post.comments?.map((comment, index) => (
                  <div key={index} className="forum-comment">
                    <p><strong>{comment.username}</strong>: {comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 💬 Add Comment Input (only shown if showComments[post.id] is true) */}
            {isLoggedIn && showComments[post.id] && (
              <div className="forum-comment-form">
                <input
                  type="text"
                  className="forum-input-field"
                  placeholder="Write a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                  }
                />
                <button
                  className="forum-comment-submit"
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPosts;
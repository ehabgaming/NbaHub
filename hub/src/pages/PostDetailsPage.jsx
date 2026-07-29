import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate, useParams } from "react-router";

function PostDetailsPage() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const navigate = useNavigate();

  

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

        

      if (error) {
        console.error(error);
        setErrorMessage("Could not load this post.");
      } else {
        setPost(data);
      }

      setLoading(false);

      const { data: commentsData, error: commentsError } = await supabase
  .from("comments")
  .select("*")
  .eq("post_id", id)
  .order("created_at", { ascending: true });

if (commentsError) {
  console.error(commentsError);
  setCommentError("Could not load comments.");
} else {
  setComments(commentsData);
}

      
    }

    fetchPost();

    
  }, [id]);

  async function handleUpvote() {
    if (!post || upvoting) return;

    setUpvoting(true);
    setErrorMessage("");

    const newUpvoteCount = Number(post.upvotes ?? 0) + 1;

    const { error } = await supabase
      .from("posts")
      .update({ upvotes: newUpvoteCount })
      .eq("id", id);

    if (error) {
      console.error(error);
      setErrorMessage("Could not upvote this post.");
      setUpvoting(false);
      return;
    }

    setPost((currentPost) => ({
      ...currentPost,
      upvotes: newUpvoteCount,
    }));

    setUpvoting(false);
  }

  async function handleDelete() {
  const confirmed = window.confirm(
    "Are you sure you want to delete this post?"
  );

  if (!confirmed) {
    return;
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    setErrorMessage("Could not delete this post.");
    return;
  }

  navigate("/");
}

  async function handleCommentSubmit(event) {
  event.preventDefault();

  if (commentText.trim() === "") {
    setCommentError("Comment cannot be empty.");
    return;
  }

  setSubmittingComment(true);
  setCommentError("");

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: Number(id),
      content: commentText.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    setCommentError(error.message);
    setSubmittingComment(false);
    return;
  }

  setComments((currentComments) => [...currentComments, data]);
  setCommentText("");
  setSubmittingComment(false);
}

  if (loading) {
    return <p className="loading-message">Loading post...</p>;
  }

  if (!post) {
    return <p className="error-message">{errorMessage || "Post not found."}</p>;
  }

  return (
  <main className="page-container">
    <article className="full-post">
      <p className="post-meta">
        Submitted on {new Date(post.created_at).toLocaleString()}
      </p>
      
      <h1>{post.title}</h1>
      <span className="category-tag">
  {post.category || "Discussion"}
</span>

      {post.content && (
        <p className="full-post-content">{post.content}</p>
      )}

      {post.image_url && (
        <img
          className="post-image"
          src={post.image_url}
          alt={post.title}
        />
      )}

      <div className="post-actions">
  <button type="button" onClick={handleUpvote}>
    ▲ Upvote
  </button>

  <span>
    <strong>{post.upvotes}</strong> upvotes
  </span>

  <Link to={`/edit/${post.id}`}>Edit Post</Link>

  <button
    type="button"
    className="delete-button"
    onClick={handleDelete}
  >
    Delete Post
  </button>
</div>
      

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}
    </article>

    <section className="comments-section">
      <h2>Comments</h2>

      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <textarea
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="What do you think?"
          rows="4"
        />

        {commentError && (
          <p className="error-message">{commentError}</p>
        )}

        <button type="submit" disabled={submittingComment}>
          {submittingComment ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <article className="comment-card" key={comment.id}>
              <p className="comment-meta">
                Posted {new Date(comment.created_at).toLocaleString()}
              </p>

              <p>{comment.content}</p>
            </article>
          ))
        )}
      </div>
    </section>
  </main>
);
}

export default PostDetailsPage;
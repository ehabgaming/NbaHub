import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { supabase } from "../lib/supabase";

const categories = [
  "Discussion",
  "NBA News",
  "Trade Rumors",
  "Highlights",
  "Memes",
  "Fantasy Basketball",
];

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState("Discussion");

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setErrorMessage("Could not load this post.");
      } else {
        setTitle(data.title || "");
        setContent(data.content || "");
        setImageUrl(data.image_url || "");
      }

      setLoading(false);
    }

    fetchPost();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (title.trim() === "") {
      setErrorMessage("A title is required.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase
      .from("posts")
      .update({
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl.trim(),
        category,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    navigate(`/post/${id}`);
  }

  if (loading) {
    return <p className="loading-message">Loading post...</p>;
  }

  return (
    <main className="page-container">
        <div className="form-group">
  <label htmlFor="category">Category</label>

  <select
    id="category"
    value={category}
    onChange={(event) => setCategory(event.target.value)}
  >
    {categories.map((categoryName) => (
      <option key={categoryName} value={categoryName}>
        {categoryName}
      </option>
    ))}
  </select>
</div>
      <h1 className="page-title">Edit NBA Post</h1>

      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Post title</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows="6"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>

          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </div>

        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}

export default EditPostPage;
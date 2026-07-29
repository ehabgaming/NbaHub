import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

const categories = [
  "Discussion",
  "NBA News",
  "Trade Rumors",
  "Highlights",
  "Memes",
  "Fantasy Basketball",
];

function CreatePostPage() {
    
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState("Discussion");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage("A title is required.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const { error } = await supabase.from("posts").insert({
      title: title.trim(),
      content: content.trim(),
      image_url: imageUrl.trim() || null,
      category,
      upvotes: 0,
    });

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    navigate("/");
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
      <h1 className="page-title">Submit a New NBA Post</h1>

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

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit post"}
        </button>
      </form>
    </main>
  );
}

export default CreatePostPage;
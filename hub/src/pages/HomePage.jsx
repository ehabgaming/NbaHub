import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";

const categories = [
  "All",
  "Discussion",
  "NBA News",
  "Trade Rumors",
  "Highlights",
  "Memes",
  "Fantasy Basketball",
];

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
  .from("posts")
  .select(`
    *,
    comments(id)
  `);

      if (error) {
        console.error(error);
        setErrorMessage("Could not load posts.");
      } else {
        setPosts(data ?? []);
      }

      setLoading(false);
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
  const matchesSearch = post.title
    .toLowerCase()
    .includes(searchText.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    (post.category || "Discussion") === selectedCategory;

  return matchesSearch && matchesCategory;
});

  const displayedPosts = [...filteredPosts].sort((postA, postB) => {
    if (sortOption === "upvotes") {
      return (postB.upvotes ?? 0) - (postA.upvotes ?? 0);
    }

    return new Date(postB.created_at) - new Date(postA.created_at);
  });

  if (loading) {
    return <p className="loading-message">Loading posts...</p>;
  }

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  return (
    <main className="page-container">
      <h1 className="page-title">NBAHub Posts</h1>
      

      <div className="feed-controls">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search NBAHub posts..."
        />
        <select
  value={selectedCategory}
  onChange={(event) => setSelectedCategory(event.target.value)}
>
  {categories.map((categoryName) => (
    <option key={categoryName} value={categoryName}>
      {categoryName}
    </option>
  ))}
</select>

        <select
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
      </div>

      {displayedPosts.length === 0 ? (
        <p className="empty-message">No posts match your search.</p>
      ) : (
        <div className="posts-list">
          {displayedPosts.map((post) => (
            <Link
              className="post-link"
              key={post.id}
              to={`/post/${post.id}`}
            >
              <article className="post-card">
                <div className="vote-column">
                  <span className="vote-arrow">▲</span>
                  <span className="vote-count">{post.upvotes ?? 0}</span>
                  <span className="vote-arrow">▼</span>
                  <span className="comment-count">
  💬 {post.comments?.length ?? 0}
</span>
                </div>

                <div className="post-information">
                  <h2 className="post-title">{post.title}</h2>

                  <span className="category-tag">
  {post.category || "Discussion"}
</span>


                  <p className="post-meta">
                    Submitted on{" "}
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage;
import { Routes, Route } from "react-router";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import EditPostPage from "./pages/EditPostPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/post/:id" element={<PostDetailsPage />} />
        <Route path="/edit/:id" element={<EditPostPage />} />
      </Routes>
    </>
  );
}

export default App;
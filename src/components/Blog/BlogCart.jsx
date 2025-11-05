// src/components/Blog/BlogCart.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BlogCart.css";

const BlogCart = ({ post }) => {
  return (
    <div className="related-post-card">
      <Link to={`/blog/${post.id}`} className="related-post-link">
        <img src={post.image} alt={post.title} className="related-post-image" />
        <h4 className="related-post-title">{post.title}</h4>
      </Link>
    </div>
  );
};

export default BlogCart;

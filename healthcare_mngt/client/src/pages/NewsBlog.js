import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import "../styles/newsBlog.css"; 
import Footer from "../components/Footer";

const NewsBlog = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHealthcareNews();
  }, []);

  const fetchHealthcareNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/v1/news/latest");
      setNews(response.data.articles || []);
    } catch (error) {
      console.error("❌ Error fetching news:", error);
      setError("Failed to load healthcare news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="news-container">
        <h1 className="news-title">📰 Latest Healthcare News & Blogs</h1>

        {loading && <p className="loading-text">⏳ Fetching latest news...</p>}
        {error && <p className="error-text">❌ {error}</p>}

        <div className="news-grid">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="news-card">
                <img
                  src={article.urlToImage || "https://via.placeholder.com/400"}
                  alt={article.title || "News Image"}
                  className="news-image"
                />
                <div className="news-content">
                  <h3 className="news-heading">{article.title}</h3>
                  <p className="news-summary">
                    {article.description ? article.description.substring(0, 150) + "..." : "No summary available."}
                  </p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                    🔗 Read Full Article
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="no-news-text">No news available. Try again later.</p>
          )}
        </div>

        <div className="reload-section">
          <button onClick={fetchHealthcareNews} className="reload-btn">
            {loading ? "🔄 Refreshing..." : "🔄 Refresh News"}
          </button>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default NewsBlog;

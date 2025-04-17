const axios = require("axios");

let cachedNews = null;
let lastFetchTime = 0;

const getHealthcareNews = async (req, res) => {
  try {
    if (!process.env.NEWS_API_KEY) {
      console.error("❌ NEWS_API_KEY is missing in environment variables.");
      return res.status(500).json({ success: false, message: "API key is missing." });
    }

    const TEN_MINUTES = 10 * 60 * 1000;
    if (cachedNews && Date.now() - lastFetchTime < TEN_MINUTES) {
      console.log("✅ Returning cached news data.");
      return res.status(200).json({ success: true, articles: cachedNews });
    }

    const newsAPIUrl = `https://newsapi.org/v2/everything?q=healthcare&apiKey=${process.env.NEWS_API_KEY}`;
    const newsRes = await axios.get(newsAPIUrl);

    if (!newsRes.data || !newsRes.data.articles) {
      throw new Error("Invalid response from News API");
    }

    cachedNews = newsRes.data.articles;
    lastFetchTime = Date.now();

    console.log(`✅ Fetched ${newsRes.data.articles.length} articles.`);
    res.status(200).json({ success: true, articles: cachedNews });
  } catch (error) {
    console.error("❌ Error fetching news:", error.message || error);
    res.status(500).json({ success: false, message: "Error fetching news" });
  }
};

module.exports = { getHealthcareNews };

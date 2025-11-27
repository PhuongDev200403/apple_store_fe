import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaEye, FaUser } from 'react-icons/fa';
import { getActiveNews, getFeaturedNews } from '../../utils/api/newsApi';
import './NewsPage.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [featuredList, setFeaturedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Lấy tin tức đang hoạt động và tin nổi bật song song
      const [activeNewsData, featuredNewsData] = await Promise.all([
        getActiveNews(),
        getFeaturedNews()
      ]);
      
      setNewsList(Array.isArray(activeNewsData) ? activeNewsData : []);
      setFeaturedList(Array.isArray(featuredNewsData) ? featuredNewsData : []);
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Không thể tải tin tức. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="news-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải tin tức...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <div className="container">
          <div className="error-state">
            <p>{error}</p>
            <button onClick={loadNews} className="retry-btn">Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  // Mock data backup nếu API không trả về dữ liệu
  const mockNewsList = [
    {
      id: 1,
      title: "'Thò thụt': iPhone đã đúng khi không đụng đến tính năng này suốt những năm qua - Đình đám một thời nay đã chết yểu",
      excerpt: "iPhone vẫn kiên định với thiết kế tai thỏ suốt nhiều năm dù bị nhiều người dùng chỉ trích. Thế nhưng, có vẻ như Apple một lần nữa đã sáng suốt. Cái chết của camera thò thụt Nỗi ám ảnh về màn hình không viền trên điện...",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&q=80",
      date: "28/04/2023",
      author: "TechNews",
      views: "12.5k",
      category: "iPhone"
    },
    {
      id: 2,
      title: "CÚ BẮT TAY BOM TẤN GIỮA APPLE VÀ GOLDMAN SACHS: KHÔNG MÀ...",
      excerpt: "Apple hợp tác với Goldman Sachs được dự đoán sẽ làm thay đổi tương lai ngành ngân hàng. Tuần trước,...",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&q=80",
      date: "28/04/2023",
      author: "Finance News",
      views: "8.2k",
      category: "Tài chính"
    },
    {
      id: 3,
      title: "IPHONE 15 ULTRA SẼ 'CẮT ĐUÔI' ĐỐI THỦ NHỜ TRANG BỊ 'CÓ MỘT...",
      excerpt: "Cải thiện khả năng chụp ảnh luôn là ưu tiên hàng đầu của Apple trong mỗi dịp ra mắt iPhone. Năm nay, mẫ...",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&q=80",
      date: "28/04/2023",
      author: "TechNews",
      views: "15.3k",
      category: "iPhone"
    },
    {
      id: 4,
      title: "NGƯỜI VIỆT CHI HƠN 1,6 TỶ USD NHẬP KHẨU IPHONE",
      excerpt: "Báo cáo xuất nhập khẩu năm 2022 vừa được Bộ Công Thương công bố cho thấy trong năm 2022, nhập kh...",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&q=80",
      date: "28/04/2023",
      author: "Economic News",
      views: "9.7k",
      category: "Kinh tế"
    },
    {
      id: 5,
      title: "MACBOOK PRO M3: HIỆU NĂNG VƯỢT TRỘI CHO CÔNG VIỆC CHUYÊN NGHIỆP",
      excerpt: "MacBook Pro M3 mang đến hiệu năng đỉnh cao với chip M3 mới nhất từ Apple...",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&q=80",
      date: "27/04/2023",
      author: "TechNews",
      views: "11.2k",
      category: "MacBook"
    },
    {
      id: 6,
      title: "IPAD AIR 2024: THIẾT KẾ MỎNG NHẸ, HIỆU NĂNG MẠNH MẼ",
      excerpt: "iPad Air 2024 với thiết kế mỏng nhẹ và chip M1 mạnh mẽ, phù hợp cho mọi nhu cầu...",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&q=80",
      date: "26/04/2023",
      author: "TechNews",
      views: "7.8k",
      category: "iPad"
    },
    {
      id: 7,
      title: "APPLE WATCH SERIES 9: THEO DÕI SỨC KHỎE THÔNG MINH HƠN",
      excerpt: "Apple Watch Series 9 với nhiều tính năng theo dõi sức khỏe mới và thiết kế đẹp mắt...",
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop&q=80",
      date: "25/04/2023",
      author: "TechNews",
      views: "6.4k",
      category: "Apple Watch"
    },
    {
      id: 8,
      title: "AIRPODS PRO 3: CHẤT LƯỢNG ÂM THANH VƯỢT TRỘI",
      excerpt: "AirPods Pro 3 mang đến trải nghiệm âm thanh tuyệt vời với công nghệ Active Noise Cancellation...",
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop&q=80",
      date: "24/04/2023",
      author: "TechNews",
      views: "5.2k",
      category: "AirPods"
    }
  ];

  // Sử dụng dữ liệu từ API hoặc mock data
  const displayNewsList = newsList.length > 0 ? newsList : mockNewsList;
  const displayFeaturedNews = featuredList.length > 0 ? featuredList[0] : null;

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-layout">
          {/* Cột trái - Danh sách tin tức */}
          <div className="main-content">
            <h2 className="section-title">Tin tức công nghệ</h2>
            {displayNewsList.length === 0 ? (
              <div className="empty-state">
                <p>Chưa có tin tức nào</p>
              </div>
            ) : (
              <div className="news-grid">
                {displayNewsList.map((news) => (
                  <article key={news.id} className="news-card">
                    <Link to={`/tin-tuc/${news.id}`} className="news-link">
                      <div className="news-image">
                        <img 
                          src={news.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                          alt={news.title} 
                        />
                        {news.isFeatured && <div className="news-badge">⭐ Nổi bật</div>}
                      </div>
                      <div className="news-content">
                        <div className="news-meta">
                          <div className="meta-item">
                            <FaClock className="meta-icon" />
                            <span>{formatDate(news.publishedAt)}</span>
                          </div>
                        </div>
                        <h3 className="news-title">{news.title}</h3>
                        <p className="news-excerpt">
                          {news.content?.substring(0, 150)}
                          {news.content?.length > 150 ? '...' : ''}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Cột phải - Tin tức nổi bật */}
          <aside className="featured-sidebar">
            <h3 className="sidebar-title">Tin tức nổi bật</h3>
            {displayFeaturedNews ? (
              <Link to={`/tin-tuc/${displayFeaturedNews.id}`} className="featured-link">
                <article className="featured-article">
                  <div className="featured-image">
                    <img 
                      src={displayFeaturedNews.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'} 
                      alt={displayFeaturedNews.title} 
                    />
                    <div className="featured-badge">⭐ Nổi bật</div>
                  </div>
                  <div className="featured-content">
                    <div className="featured-meta">
                      <div className="meta-item">
                        <FaClock className="meta-icon" />
                        <span>{formatDate(displayFeaturedNews.publishedAt)}</span>
                      </div>
                    </div>
                    <h4 className="featured-title">{displayFeaturedNews.title}</h4>
                    <p className="featured-excerpt">
                      {displayFeaturedNews.content?.substring(0, 200)}
                      {displayFeaturedNews.content?.length > 200 ? '...' : ''}
                    </p>
                  </div>
                </article>
              </Link>
            ) : (
              <div className="empty-featured">
                <p>Chưa có tin nổi bật</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}


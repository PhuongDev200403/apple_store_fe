import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaClock, FaEye, FaUser, FaShare, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { getNewsById, getActiveNews } from '../../utils/api/newsApi';
import './NewsDetailPage.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export default function NewsDetailPage() {
  const { newsId } = useParams();
  const navigate = useNavigate();
  const [currentNews, setCurrentNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNewsDetail();
  }, [newsId]);

  const loadNewsDetail = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Lấy chi tiết tin tức và tin liên quan
      const [newsDetail, allNews] = await Promise.all([
        getNewsById(newsId),
        getActiveNews()
      ]);
      
      setCurrentNews(newsDetail);
      
      // Lọc tin liên quan (loại trừ tin hiện tại)
      const related = Array.isArray(allNews) 
        ? allNews.filter(news => news.id !== parseInt(newsId)).slice(0, 4)
        : [];
      setRelatedNews(related);
    } catch (err) {
      console.error('Error loading news detail:', err);
      setError('Không thể tải tin tức. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="news-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải tin tức...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentNews) {
    return (
      <div className="news-detail-page">
        <div className="container">
          <div className="error-state">
            <p>{error || 'Không tìm thấy tin tức'}</p>
            <button onClick={() => navigate('/tin-tuc')} className="back-btn">
              Quay lại danh sách tin tức
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mock data backup
  const newsData = {
    1: {
      id: 1,
      title: "'Thò thụt': iPhone đã đúng khi không đụng đến tính năng này suốt những năm qua - Đình đám một thời nay đã chết yểu",
      excerpt: "iPhone vẫn kiên định với thiết kế tai thỏ suốt nhiều năm dù bị nhiều người dùng chỉ trích. Thế nhưng, có vẻ như Apple một lần nữa đã sáng suốt.",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=600&fit=crop&q=80",
      date: "28/04/2023",
      author: "TechNews",
      views: "12.5k",
      category: "iPhone",
      content: `
        <p>iPhone vẫn kiên định với thiết kế tai thỏ suốt nhiều năm dù bị nhiều người dùng chỉ trích. Thế nhưng, có vẻ như Apple một lần nữa đã sáng suốt khi không theo đuổi xu hướng camera thò thụt.</p>
        
        <h2>Cái chết của camera thò thụt</h2>
        <p>Nỗi ám ảnh về màn hình không viền trên điện thoại đã dẫn đến sự ra đời của nhiều giải pháp sáng tạo, trong đó có camera selfie thò thụt (pop-up camera). Tuy nhiên, xu hướng này đang dần biến mất.</p>
        
        <p>Các nhà sản xuất như OnePlus, Vivo, và Oppo đã từng tích cực sử dụng công nghệ này để tạo ra những chiếc điện thoại có màn hình gần như không viền. Nhưng giờ đây, hầu hết đều đã chuyển sang các giải pháp khác như notch, punch-hole, hoặc under-display camera.</p>
        
        <h2>Tại sao camera thò thụt thất bại?</h2>
        <p>Có nhiều lý do khiến camera thò thụt không được ưa chuộng:</p>
        
        <ul>
          <li><strong>Độ bền:</strong> Cơ chế thò thụt có nhiều bộ phận chuyển động, dễ hỏng hơn so với camera cố định.</li>
          <li><strong>Khả năng chống nước:</strong> Khó đảm bảo tính kín nước khi có nhiều khe hở.</li>
          <li><strong>Chi phí sản xuất:</strong> Phức tạp hơn và đắt hơn so với camera thông thường.</li>
          <li><strong>Tiêu thụ pin:</strong> Cơ chế thò thụt tiêu tốn thêm năng lượng.</li>
        </ul>
        
        <h2>Apple đã đúng từ đầu</h2>
        <p>Apple đã chọn giải pháp tai thỏ (notch) từ iPhone X và vẫn giữ nguyên thiết kế này qua nhiều thế hệ. Mặc dù bị chỉ trích, nhưng đây là một lựa chọn thực tế và ổn định.</p>
        
        <p>Với iPhone 14 Pro, Apple đã chuyển sang Dynamic Island - một giải pháp thông minh hơn, biến notch thành một tính năng hữu ích thay vì chỉ là một "vết sẹo" trên màn hình.</p>
        
        <h2>Kết luận</h2>
        <p>Sự biến mất của camera thò thụt cho thấy rằng không phải tất cả các xu hướng công nghệ đều thành công. Đôi khi, những giải pháp đơn giản và ổn định như tai thỏ của Apple lại là lựa chọn tốt nhất trong dài hạn.</p>
        
        <p>Điều này cũng cho thấy tầm nhìn của Apple trong việc cân bằng giữa thẩm mỹ và thực dụng, luôn ưu tiên trải nghiệm người dùng ổn định hơn là những tính năng "hoành tráng" nhưng không bền vững.</p>
      `
    },
    2: {
      id: 2,
      title: "CÚ BẮT TAY BOM TẤN GIỮA APPLE VÀ GOLDMAN SACHS: KHÔNG MÀ...",
      excerpt: "Apple hợp tác với Goldman Sachs được dự đoán sẽ làm thay đổi tương lai ngành ngân hàng. Tuần trước, hai gã khổng lồ này đã công bố kế hoạch hợp tác chiến lược.",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=600&fit=crop&q=80",
      date: "28/04/2023",
      author: "Finance News",
      views: "8.2k",
      category: "Tài chính",
      content: `
        <p>Apple và Goldman Sachs vừa công bố một thỏa thuận hợp tác chiến lược có thể thay đổi hoàn toàn bộ mặt của ngành ngân hàng và công nghệ tài chính.</p>
        
        <h2>Chi tiết về thỏa thuận</h2>
        <p>Thỏa thuận này bao gồm việc tích hợp các dịch vụ tài chính của Goldman Sachs vào hệ sinh thái Apple, từ Apple Pay đến Apple Card và các dịch vụ ngân hàng kỹ thuật số.</p>
        
        <p>Hai công ty sẽ cùng phát triển các sản phẩm tài chính mới, tập trung vào trải nghiệm người dùng và bảo mật cao.</p>
        
        <h2>Tác động đến thị trường</h2>
        <p>Thỏa thuận này được dự đoán sẽ tạo ra một cuộc cách mạng trong ngành fintech, với Apple có thể trở thành một trong những ngân hàng kỹ thuật số lớn nhất thế giới.</p>
        
        <p>Các ngân hàng truyền thống có thể phải đối mặt với áp lực cạnh tranh lớn hơn từ sự kết hợp giữa công nghệ Apple và chuyên môn tài chính của Goldman Sachs.</p>
        
        <h2>Lợi ích cho người dùng</h2>
        <p>Người dùng có thể mong đợi:</p>
        <ul>
          <li>Trải nghiệm tài chính mượt mà hơn</li>
          <li>Tích hợp sâu hơn với các thiết bị Apple</li>
          <li>Các tính năng bảo mật tiên tiến</li>
          <li>Phí giao dịch thấp hơn</li>
        </ul>
        
        <h2>Tương lai của ngành tài chính</h2>
        <p>Thỏa thuận này đánh dấu một bước ngoặt quan trọng trong việc chuyển đổi số của ngành ngân hàng, với công nghệ đóng vai trò ngày càng quan trọng trong việc định hình tương lai của các dịch vụ tài chính.</p>
      `
    },
    3: {
      id: 3,
      title: "IPHONE 15 ULTRA SẼ 'CẮT ĐUÔI' ĐỐI THỦ NHỜ TRANG BỊ 'CÓ MỘT...",
      excerpt: "Cải thiện khả năng chụp ảnh luôn là ưu tiên hàng đầu của Apple trong mỗi dịp ra mắt iPhone. Năm nay, mẫu iPhone 15 Ultra được kỳ vọng sẽ có những cải tiến vượt trội.",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&h=600&fit=crop&q=80",
      date: "28/04/2023",
      author: "TechNews",
      views: "15.3k",
      category: "iPhone",
      content: `
        <p>Cải thiện khả năng chụp ảnh luôn là ưu tiên hàng đầu của Apple trong mỗi dịp ra mắt iPhone. Năm nay, mẫu iPhone 15 Ultra được kỳ vọng sẽ có những cải tiến vượt trội so với các đối thủ.</p>
        
        <h2>Camera hệ thống mới</h2>
        <p>iPhone 15 Ultra được trang bị hệ thống camera hoàn toàn mới với cảm biến 48MP chính, camera telephoto với khả năng zoom quang học 10x và camera ultra-wide góc rộng.</p>
        
        <p>Công nghệ xử lý hình ảnh AI được nâng cấp đáng kể, cho phép chụp ảnh trong điều kiện thiếu sáng tốt hơn và giảm noise hiệu quả.</p>
        
        <h2>Chip A17 Pro mạnh mẽ</h2>
        <p>Được trang bị chip A17 Pro mới nhất, iPhone 15 Ultra có khả năng xử lý hình ảnh real-time với hiệu năng vượt trội.</p>
        
        <p>Chip này cũng hỗ trợ các tính năng AI tiên tiến như nhận diện đối tượng thông minh và tự động điều chỉnh thông số chụp ảnh.</p>
        
        <h2>Thiết kế Titanium cao cấp</h2>
        <p>iPhone 15 Ultra sử dụng vật liệu Titanium cao cấp, giúp máy nhẹ hơn nhưng vẫn đảm bảo độ bền cao.</p>
        
        <p>Thiết kế mới với các góc bo tròn mềm mại hơn, tạo cảm giác cầm nắm thoải mái hơn so với các thế hệ trước.</p>
        
        <h2>Kết luận</h2>
        <p>Với những cải tiến vượt trội về camera, hiệu năng và thiết kế, iPhone 15 Ultra được dự đoán sẽ "cắt đuôi" các đối thủ trong cuộc đua smartphone cao cấp năm 2024.</p>
      `
    },
    4: {
      id: 4,
      title: "MACBOOK PRO M3: HIỆU NĂNG VƯỢT TRỘI CHO CÔNG VIỆC CHUYÊN NGHIỆP",
      excerpt: "MacBook Pro M3 mang đến hiệu năng đỉnh cao với chip M3 mới nhất từ Apple, phù hợp cho các công việc chuyên nghiệp.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=600&fit=crop&q=80",
      date: "27/04/2023",
      author: "TechNews",
      views: "11.2k",
      category: "MacBook",
      content: `
        <p>MacBook Pro M3 mang đến hiệu năng đỉnh cao với chip M3 mới nhất từ Apple, được thiết kế đặc biệt cho các công việc chuyên nghiệp đòi hỏi sức mạnh xử lý cao.</p>
        
        <h2>Chip M3 - Bước nhảy vọt về hiệu năng</h2>
        <p>Chip M3 với kiến trúc 3nm mới mang lại hiệu năng xử lý CPU nhanh hơn 20% và GPU mạnh hơn 30% so với thế hệ M2 trước đó.</p>
        
        <p>Đặc biệt, chip M3 được tối ưu hóa cho các tác vụ AI và machine learning, giúp tăng tốc đáng kể các ứng dụng chuyên nghiệp.</p>
        
        <h2>Màn hình Liquid Retina XDR tuyệt đẹp</h2>
        <p>MacBook Pro M3 trang bị màn hình Liquid Retina XDR với độ phân giải cao và dải màu rộng, hoàn hảo cho công việc thiết kế và chỉnh sửa video.</p>
        
        <p>Hỗ trợ HDR với độ sáng lên đến 1000 nits, mang lại trải nghiệm xem nội dung tuyệt vời.</p>
        
        <h2>Thời lượng pin ấn tượng</h2>
        <p>Với kiến trúc chip hiệu quả, MacBook Pro M3 có thể hoạt động liên tục lên đến 22 giờ cho việc duyệt web và 18 giờ cho phát video.</p>
        
        <p>Điều này đảm bảo người dùng có thể làm việc cả ngày mà không cần lo lắng về pin.</p>
        
        <h2>Kết luận</h2>
        <p>MacBook Pro M3 là lựa chọn hoàn hảo cho các chuyên gia cần hiệu năng cao, từ lập trình viên, nhà thiết kế đến nhà sản xuất nội dung.</p>
      `
    },
    5: {
      id: 5,
      title: "IPAD AIR 2024: THIẾT KẾ MỎNG NHẸ, HIỆU NĂNG MẠNH MẼ",
      excerpt: "iPad Air 2024 với thiết kế mỏng nhẹ và chip M1 mạnh mẽ, phù hợp cho mọi nhu cầu từ học tập đến công việc.",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&h=600&fit=crop&q=80",
      date: "26/04/2023",
      author: "TechNews",
      views: "7.8k",
      category: "iPad",
      content: `
        <p>iPad Air 2024 với thiết kế mỏng nhẹ và chip M1 mạnh mẽ, mang đến trải nghiệm tuyệt vời cho mọi nhu cầu từ học tập đến công việc chuyên nghiệp.</p>
        
        <h2>Thiết kế mỏng nhẹ, đẹp mắt</h2>
        <p>iPad Air 2024 có độ dày chỉ 6.1mm và trọng lượng 461g, mang lại cảm giác cầm nắm thoải mái trong thời gian dài.</p>
        
        <p>Thiết kế với các góc bo tròn mềm mại và màu sắc đa dạng, phù hợp với mọi phong cách cá nhân.</p>
        
        <h2>Chip M1 - Hiệu năng đỉnh cao</h2>
        <p>Được trang bị chip M1 mạnh mẽ, iPad Air 2024 có thể xử lý mượt mà các ứng dụng chuyên nghiệp như Adobe Photoshop, Final Cut Pro và các game đồ họa cao.</p>
        
        <p>Hiệu năng CPU nhanh hơn 60% và GPU mạnh hơn 100% so với thế hệ trước.</p>
        
        <h2>Màn hình Liquid Retina 10.9 inch</h2>
        <p>Màn hình Liquid Retina với độ phân giải cao và True Tone tự động điều chỉnh màu sắc theo ánh sáng môi trường.</p>
        
        <p>Hỗ trợ Apple Pencil (thế hệ 2) với độ trễ thấp, hoàn hảo cho việc vẽ và ghi chú.</p>
        
        <h2>Camera và kết nối</h2>
        <p>Camera sau 12MP với khả năng chụp ảnh 4K và camera trước 7MP cho FaceTime chất lượng cao.</p>
        
        <p>Hỗ trợ USB-C với tốc độ truyền dữ liệu nhanh và khả năng kết nối với nhiều phụ kiện.</p>
        
        <h2>Kết luận</h2>
        <p>iPad Air 2024 là sự kết hợp hoàn hảo giữa thiết kế đẹp mắt và hiệu năng mạnh mẽ, phù hợp cho mọi đối tượng người dùng.</p>
      `
    },
    6: {
      id: 6,
      title: "APPLE WATCH SERIES 9: THEO DÕI SỨC KHỎE THÔNG MINH HƠN",
      excerpt: "Apple Watch Series 9 với nhiều tính năng theo dõi sức khỏe mới và thiết kế đẹp mắt, là người bạn đồng hành hoàn hảo.",
      image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1200&h=600&fit=crop&q=80",
      date: "25/04/2023",
      author: "TechNews",
      views: "6.4k",
      category: "Apple Watch",
      content: `
        <p>Apple Watch Series 9 với nhiều tính năng theo dõi sức khỏe mới và thiết kế đẹp mắt, trở thành người bạn đồng hành hoàn hảo cho cuộc sống hiện đại.</p>
        
        <h2>Chip S9 - Hiệu năng và hiệu quả</h2>
        <p>Chip S9 mới mang lại hiệu năng xử lý nhanh hơn và tiết kiệm pin tốt hơn, cho phép Apple Watch hoạt động lâu hơn với nhiều tính năng hơn.</p>
        
        <p>Khả năng xử lý AI được cải thiện, hỗ trợ các tính năng thông minh như nhận diện giọng nói và phân tích dữ liệu sức khỏe.</p>
        
        <h2>Theo dõi sức khỏe toàn diện</h2>
        <p>Apple Watch Series 9 có thể theo dõi nhịp tim, nồng độ oxy trong máu, nhiệt độ cơ thể và nhiều chỉ số sức khỏe quan trọng khác.</p>
        
        <p>Tính năng phát hiện ngã và cảnh báo khẩn cấp giúp bảo vệ người dùng trong các tình huống nguy hiểm.</p>
        
        <h2>Thiết kế đẹp mắt và bền bỉ</h2>
        <p>Thiết kế với các góc bo tròn mềm mại và dây đeo đa dạng, phù hợp với mọi phong cách thời trang.</p>
        
        <p>Khả năng chống nước lên đến 50m, cho phép sử dụng trong mọi hoạt động thể thao dưới nước.</p>
        
        <h2>Kết nối và tiện ích</h2>
        <p>Hỗ trợ kết nối 5G và WiFi 6, đảm bảo kết nối nhanh và ổn định.</p>
        
        <p>Tích hợp sâu với hệ sinh thái Apple, đồng bộ dữ liệu với iPhone và các thiết bị khác.</p>
        
        <h2>Kết luận</h2>
        <p>Apple Watch Series 9 không chỉ là một thiết bị đeo tay thông minh, mà còn là trợ lý sức khỏe cá nhân đáng tin cậy.</p>
      `
    }
  };

  return (
    <div className="news-detail-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb-nav">
          <Link to="/tin-tuc" className="back-link">
            <FaArrowLeft className="back-icon" />
            Quay lại tin tức
          </Link>
        </nav>

        <div className="news-detail-layout">
          {/* Cột trái - Nội dung chính */}
          <main className="main-content">
            <article className="news-article">
              {/* Header */}
              <header className="article-header">
                {currentNews.isFeatured && (
                  <div className="article-badge">⭐ Tin nổi bật</div>
                )}
                <h1 className="article-title">{currentNews.title}</h1>
                <div className="article-meta">
                  <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <span>{formatDate(currentNews.publishedAt)}</span>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              <div className="article-featured-image">
                <img 
                  src={currentNews.imageUrl || 'https://via.placeholder.com/1200x600?text=No+Image'} 
                  alt={currentNews.title} 
                />
              </div>

              {/* Article Content */}
              <div className="article-body">
                <div className="article-content">
                  {currentNews.content?.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Article Actions */}
              <div className="article-actions">
                <button className="action-btn">
                  <FaHeart className="action-icon" />
                  Thích
                </button>
                <button className="action-btn">
                  <FaShare className="action-icon" />
                  Chia sẻ
                </button>
              </div>
            </article>
          </main>

          {/* Cột phải - Tin tức liên quan */}
          <aside className="related-sidebar">
            <h3 className="sidebar-title">Tin tức liên quan</h3>
            <div className="related-news">
              {relatedNews.map((news) => (
                <article key={news.id} className="related-article">
                  <Link to={`/tin-tuc/${news.id}`} className="related-link">
                    <div className="related-image">
                      <img 
                        src={news.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
                        alt={news.title} 
                      />
                      {news.isFeatured && <div className="related-badge">⭐</div>}
                    </div>
                    <div className="related-content">
                      <h4 className="related-title">{news.title}</h4>
                      <p className="related-excerpt">
                        {news.content?.substring(0, 100)}
                        {news.content?.length > 100 ? '...' : ''}
                      </p>
                      <div className="related-meta">
                        <div className="meta-item">
                          <FaClock className="meta-icon" />
                          <span>{formatDate(news.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

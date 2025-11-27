import { FaStore, FaShieldAlt, FaTag, FaAward, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import './AboutPage.css';

const AboutPage = () => {
  const stats = [
    { number: "2023", label: "Năm thành lập", icon: <FaAward /> },
    { number: "7+", label: "Chi nhánh", icon: <FaStore /> },
    { number: "3", label: "Trung tâm bảo hành", icon: <FaShieldAlt /> },
    { number: "10K+", label: "Khách hàng", icon: <FaUsers /> }
  ];

  const values = [
    {
      icon: <FaShieldAlt />,
      title: "Chất lượng đảm bảo",
      description: "100% sản phẩm chính hãng, có tem phiếu bảo hành đầy đủ"
    },
    {
      icon: <FaTag />,
      title: "Giá cả cạnh tranh",
      description: "Cam kết giá tốt nhất thị trường, tiết kiệm 15-20%"
    },
    {
      icon: <FaStore />,
      title: "Hệ thống rộng khắp",
      description: "7+ chi nhánh trên toàn quốc, dễ dàng tiếp cận"
    },
    {
      icon: <FaUsers />,
      title: "Dịch vụ tận tâm",
      description: "Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7"
    }
  ];

  const timeline = [
    {
      year: "2023",
      title: "Khởi đầu hành trình",
      description: "Sudes Phone được thành lập với sứ mệnh mang công nghệ đến gần hơn với người dùng Việt Nam"
    },
    {
      year: "2024",
      title: "Mở rộng quy mô",
      description: "Phát triển mạng lưới 7+ chi nhánh và 3 trung tâm bảo hành chuyên nghiệp"
    },
    {
      year: "Hiện tại",
      title: "Dẫn đầu thị trường",
      description: "Trở thành địa chỉ tin cậy hàng đầu với hơn 10,000 khách hàng hài lòng"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section with Image */}
      <div className="about-hero">
        <div className="hero-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1920&h=600&fit=crop" 
          alt="Sudes Phone Store"
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-title">Về Sudes Phone</h1>
          <p className="hero-subtitle">
            Địa chỉ tin cậy cho mọi nhu cầu công nghệ của bạn
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600&h=800&fit=crop" 
                alt="Sudes Phone Team"
              />
            </div>
            <div className="story-content">
              <h2 className="section-title">Câu chuyện của chúng tôi</h2>
              <p className="story-text">
                <strong>Sudes Phone</strong> được thành lập vào năm 2023 với mục tiêu trở thành nhà bán lẻ hàng đầu, 
                chuyên cung cấp các sản phẩm điện thoại và công nghệ chính hãng tại thị trường Việt Nam.
              </p>
              <p className="story-text">
                Chúng tôi hiểu rằng công nghệ không chỉ là sản phẩm, mà là cầu nối giúp mọi người kết nối, 
                làm việc và giải trí hiệu quả hơn. Vì vậy, chúng tôi cam kết mang đến những sản phẩm chất lượng 
                cao với mức giá tốt nhất, cùng dịch vụ chăm sóc khách hàng tận tâm.
              </p>
              <p className="story-text">
                Với hơn 7 chi nhánh trên khắp cả nước và 3 trung tâm bảo hành chuyên nghiệp, 
                <strong> Sudes Phone</strong> đã và đang phục vụ hàng chục nghìn khách hàng, 
                trở thành địa chỉ tin cậy cho mọi nhu cầu công nghệ.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <div className="container">
          <h2 className="section-title text-center">Giá trị cốt lõi</h2>
          <p className="section-subtitle text-center">
            Những giá trị mà chúng tôi cam kết mang đến cho khách hàng
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-section">
        <div className="container">
          <h2 className="section-title text-center">Hành trình phát triển</h2>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-year">{item.year}</div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section">
        <div className="container">
          <h2 className="section-title text-center">Hình ảnh cửa hàng</h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600&h=400&fit=crop" 
                alt="Store 1"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop" 
                alt="Store 2"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&h=400&fit=crop" 
                alt="Store 3"
              />
            </div>
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&h=400&fit=crop" 
                alt="Store 4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ghé thăm cửa hàng của chúng tôi</h2>
            <p className="cta-description">
              Hãy đến trực tiếp để trải nghiệm sản phẩm và nhận tư vấn từ đội ngũ chuyên nghiệp
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">
                <FaMapMarkerAlt /> Tìm cửa hàng gần nhất
              </button>
              <button className="btn btn-secondary">
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

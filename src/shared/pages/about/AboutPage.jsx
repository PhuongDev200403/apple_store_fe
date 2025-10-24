import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  // SVG Icons
  const PhoneIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  const StoreIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const ShieldIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const TagIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );

  const AwardIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const HeartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  const highlights = [
    {
      icon: <PhoneIcon className="highlight-icon" />,
      title: "Sản phẩm chính hãng",
      description: "100% sản phẩm công nghệ chính hãng, đảm bảo chất lượng"
    },
    {
      icon: <TagIcon className="highlight-icon" />,
      title: "Giá tốt nhất",
      description: "Giá rẻ hơn 15-20% so với thị trường, ưu đãi hấp dẫn"
    },
    {
      icon: <ShieldIcon className="highlight-icon" />,
      title: "Uy tín hàng đầu",
      description: "Địa chỉ tin cậy của người tiêu dùng Việt Nam"
    }
  ];

  const stats = [
    {
      number: "2023",
      label: "Năm thành lập",
      icon: <AwardIcon className="stat-icon" />
    },
    {
      number: "7+",
      label: "Chi nhánh toàn quốc",
      icon: <StoreIcon className="stat-icon" />
    },
    {
      number: "3",
      label: "Trung tâm bảo hành",
      icon: <ShieldIcon className="stat-icon" />
    },
    {
      number: "20%",
      label: "Tiết kiệm chi phí",
      icon: <TagIcon className="stat-icon" />
    }
  ];

  const benefits = [
    "Sản phẩm công nghệ đa dạng, phong phú",
    "Giá cả cạnh tranh, ưu đãi hấp dẫn", 
    "Dịch vụ chăm sóc khách hàng tận tình",
    "Mạng lưới chi nhánh rộng khắp cả nước",
    "Trung tâm bảo hành chuyên nghiệp",
    "Cam kết chất lượng và uy tín"
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>Nhà bán lẻ hàng đầu Việt Nam</span>
          </div>
          <h1 className="hero-title">
            Chào mừng đến với
            <span className="brand-name"> Sudes Phone</span>
          </h1>
          <p className="hero-description">
            Địa chỉ tin cậy cho mọi nhu cầu công nghệ của bạn. 
            Chúng tôi cam kết mang đến những sản phẩm chính hãng 
            với giá cả tốt nhất thị trường.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary">Khám phá ngay</button>
            <button className="btn btn-secondary">Tìm cửa hàng</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-phone">
            <PhoneIcon className="hero-phone-icon" />
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="highlights-section">
        <div className="container">
          <div className="highlights-grid">
            {highlights.map((item, index) => (
              <div key={index} className="highlight-card">
                <div className="highlight-icon-wrapper">
                  {item.icon}
                </div>
                <h3 className="highlight-title">{item.title}</h3>
                <p className="highlight-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Content Section */}
      <div className="content-section">
        <div className="container">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="section-title">Về Sudes Phone</h2>
              <div className="content-body">
                <p className="lead-text">
                  <strong>Sudes Phone</strong> nhà bán lẻ hàng đầu, chuyên cung cấp các sản phẩm 
                  điện thoại, công nghệ chính hãng tại thị trường Việt Nam.
                </p>
                <p>
                  Năm 2023, <strong>Sudes Phone</strong> được thành lập, từng bước trở thành địa chỉ 
                  đáng tin cậy của người tiêu dùng Việt. Chúng tôi đã, đang và sẽ tiếp tục nỗ lực 
                  đem đến các sản phẩm công nghệ chính hãng đa dạng, phong phú đi kèm mức giá tốt 
                  nhất phục vụ nhu cầu của quý khách hàng.
                </p>
                <p>
                  <strong>Sudes Phone</strong> hiện đã trở thành cái tên không còn xa lạ với người 
                  tiêu dùng trong nước. Hiện nay chúng tôi đang sở hữu mạng lưới hơn 7 chi nhánh 
                  phủ trên khắp cả nước, trong đó bao gồm hai trung tâm bảo hành tại Hà Nội và một 
                  trung tâm bảo hành tại thành phố Hồ Chí Minh.
                </p>
                <p>
                  Đến với chuỗi cửa hàng của <strong>Sudes Phone</strong>, quý khách có thể hoàn toàn 
                  yên tâm về uy tín, chất lượng sản phẩm với mức giá rẻ hơn khoảng 15-20% so với giá 
                  bán trên thị trường. Song song với đó, chúng tôi cũng luôn nỗ lực phục vụ đem đến 
                  trải nghiệm dịch vụ tốt nhất cho khách hàng.
                </p>
              </div>
            </div>
            <div className="content-visual">
              <div className="visual-card">
                <div className="visual-header">
                  <HeartIcon className="visual-icon" />
                  <h3>Cam kết của chúng tôi</h3>
                </div>
                <ul className="benefits-list">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="benefit-item">
                      <div className="benefit-check">✓</div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="container">
          <h2 className="stats-title">Sudes Phone trong con số</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon-wrapper">
                  {stat.icon}
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Trải nghiệm mua sắm công nghệ tuyệt vời
            </h2>
            <p className="cta-description">
              Hãy đến với Sudes Phone để khám phá những sản phẩm công nghệ mới nhất 
              với giá cả tốt nhất. Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-white">Xem sản phẩm</button>
              <button className="btn btn-outline">Liên hệ tư vấn</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
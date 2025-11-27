import { useState } from 'react';
import { FaShieldAlt, FaLock, FaUserShield, FaFileContract, FaEye, FaCheckCircle } from 'react-icons/fa';
import './PolicyPage.css';

const PolicyPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  const policyData = [
    {
      id: 1,
      icon: <FaFileContract />,
      title: "Thu thập thông tin cá nhân",
      content: [
        "Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này liên quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm một số thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi tiết tài khoản ngân hàng.",
        "Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử lý đơn đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu thông qua website và theo yêu cầu của bạn.",
        "Hơn nữa, chúng tôi sẽ sử dụng các thông tin đó để quản lý tài khoản của bạn; xác minh và thực hiện giao dịch trực tuyến, nhận diện khách vào web, nghiên cứu nhân khẩu học, gửi thông tin bao gồm thông tin sản phẩm và dịch vụ.",
        "Chúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ giao hàng cho bạn (ví dụ cho bên chuyển phát nhanh hoặc nhà cung cấp).",
        "Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì lí do bảo mật nên chúng tôi không công khai trực tiếp được.",
        "Quý khách cam kết bảo mật dữ liệu cá nhân và không được phép tiết lộ cho bên thứ ba.",
        "Chúng tôi có thể dùng thông tin cá nhân của bạn để nghiên cứu thị trường. Mọi thông tin chi tiết sẽ được ẩn và chỉ được dùng để thống kê."
      ]
    },
    {
      id: 2,
      icon: <FaLock />,
      title: "Bảo mật thông tin",
      content: [
        "Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc mất mát hoặc tiêu hủy hoặc thiệt hại cho thông tin của bạn.",
        "Chúng tôi khuyên quý khách không nên đưa thông tin chi tiết về việc thanh toán với bất kỳ ai bằng e-mail.",
        "Quý khách tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu.",
        "Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống website.",
        "Mọi vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.",
        "Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này."
      ]
    },
    {
      id: 3,
      icon: <FaUserShield />,
      title: "Quyền lợi khách hàng",
      content: [
        "Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong dữ liệu của bạn mà không mất phí.",
        "Bất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị.",
        "Quý khách có quyền yêu cầu xóa dữ liệu cá nhân khi không còn sử dụng dịch vụ.",
        "Chúng tôi cam kết phản hồi mọi yêu cầu của khách hàng trong vòng 48 giờ làm việc."
      ]
    }
  ];

  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Bảo vệ dữ liệu",
      description: "Cam kết bảo mật thông tin cá nhân của khách hàng với công nghệ mã hóa tiên tiến"
    },
    {
      icon: <FaEye />,
      title: "Minh bạch",
      description: "Rõ ràng trong việc thu thập và sử dụng thông tin, không chia sẻ cho bên thứ ba"
    },
    {
      icon: <FaLock />,
      title: "An toàn tuyệt đối",
      description: "Áp dụng các biện pháp bảo mật đạt chuẩn quốc tế để bảo vệ dữ liệu"
    }
  ];

  const commitments = [
    "Không chia sẻ thông tin cá nhân cho bên thứ ba khi chưa có sự đồng ý",
    "Mã hóa tất cả thông tin thanh toán và giao dịch",
    "Tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân",
    "Cập nhật thường xuyên các biện pháp bảo mật",
    "Đào tạo nhân viên về quy trình bảo mật thông tin",
    "Phản hồi nhanh chóng mọi yêu cầu về quyền riêng tư"
  ];

  return (
    <div className="policy-page">
      {/* Hero Section */}
      <div className="policy-hero">
        <div className="hero-overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=600&fit=crop" 
          alt="Privacy Policy"
          className="hero-image"
        />
        <div className="hero-content">
          <div className="hero-icon">
            <FaShieldAlt />
          </div>
          <h1 className="hero-title">Chính sách bảo mật</h1>
          <p className="hero-subtitle">
            Cam kết bảo vệ thông tin và quyền riêng tư của khách hàng
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="intro-section">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-image">
              <img 
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=800&fit=crop" 
                alt="Data Protection"
              />
            </div>
            <div className="intro-content">
              <h2 className="section-title">Cam kết của chúng tôi</h2>
              <p className="intro-text">
                Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) 
                tiết lộ thông tin cá nhân của Quý khách.
              </p>
              <p className="intro-text">
                Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. 
                Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung 
                của Chính sách bảo mật.
              </p>
              <p className="intro-text">
                Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán và sẽ giữ thông tin 
                của khách hàng trong thời gian luật pháp quy định hoặc cho mục đích nào đó.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Sections */}
      <div className="policy-sections">
        <div className="container">
          <h2 className="section-title text-center">Chi tiết chính sách</h2>
          <p className="section-subtitle text-center">
            Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn
          </p>
          
          <div className="sections-list">
            {policyData.map((section, index) => (
              <div key={section.id} className="policy-section">
                <button
                  onClick={() => toggleSection(index)}
                  className={`section-header ${activeSection === index ? 'active' : ''}`}
                >
                  <div className="section-header-left">
                    <div className="section-icon">{section.icon}</div>
                    <h3 className="section-title-text">
                      {index + 1}. {section.title}
                    </h3>
                  </div>
                  <div className="section-chevron">
                    {activeSection === index ? '−' : '+'}
                  </div>
                </button>
                
                {activeSection === index && (
                  <div className="section-content">
                    <div className="section-content-inner">
                      {section.content.map((paragraph, pIndex) => (
                        <div key={pIndex} className="section-paragraph">
                          <FaCheckCircle className="check-icon" />
                          <p>{paragraph}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commitments Section */}
      <div className="commitments-section">
        <div className="container">
          <div className="commitments-grid">
            <div className="commitments-content">
              <h2 className="section-title">Cam kết bảo mật</h2>
              <p className="commitments-intro">
                Chúng tôi cam kết thực hiện các biện pháp sau để đảm bảo an toàn thông tin của bạn:
              </p>
              <div className="commitments-list">
                {commitments.map((commitment, index) => (
                  <div key={index} className="commitment-item">
                    <FaCheckCircle className="commitment-icon" />
                    <span>{commitment}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="commitments-image">
              <img 
                src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=800&fit=crop" 
                alt="Security"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Có câu hỏi về chính sách?</h2>
            <p className="cta-description">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn về chính sách bảo mật
            </p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Liên hệ hỗ trợ</button>
              <button className="btn btn-secondary">Gọi hotline: 1900 6750</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="footer-note">
        <div className="container">
          <p className="footer-text">
            © 2024 Sudes Phone. Chính sách này có hiệu lực từ ngày cập nhật và có thể được thay đổi theo thời gian.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;

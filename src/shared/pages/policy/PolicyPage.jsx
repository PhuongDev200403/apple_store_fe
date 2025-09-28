import React, { useState } from 'react';
import './PolicyPage.css'; // Import CSS file

const PolicyPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  // SVG Icons as components
  const ShieldIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const LockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const UserIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const FileTextIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const EyeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const ChevronRightIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );

  const ChevronDownIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const policyData = [
    {
      id: 1,
      icon: <FileTextIcon className="icon" />,
      title: "Thu thập thông tin cá nhân",
      content: [
        "Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này liên quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm một số thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi tiết tài khoản ngân hàng.",
        "Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử lý đơn đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu thông qua website và theo yêu cầu của bạn.",
        "Hơn nữa, chúng tôi sẽ sử dụng các thông tin đó để quản lý tài khoản của bạn; xác minh và thực hiện giao dịch trực tuyến, nhận diện khách vào web, nghiên cứu nhân khẩu học, gửi thông tin bao gồm thông tin sản phẩm và dịch vụ. Nếu quý khách không muốn nhận bất cứ thông tin tiếp thị của chúng tôi thì có thể từ chối bất cứ lúc nào.",
        "Chúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ giao hàng cho bạn (ví dụ cho bên chuyển phát nhanh hoặc nhà cung cấp).",
        "Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì lí do bảo mật nên chúng tôi không công khai trực tiếp được. Tuy nhiên, quý khách có thể tiếp cận thông tin bằng cách đăng nhập tài khoản trên web.",
        "Quý khách cam kết bảo mật dữ liệu cá nhân và không được phép tiết lộ cho bên thứ ba. Chúng tôi không chịu bất kỳ trách nhiệm nào cho việc dùng sai mật khẩu nếu đây không phải lỗi của chúng tôi.",
        "Chúng tôi có thể dùng thông tin cá nhân của bạn để nghiên cứu thị trường. Mọi thông tin chi tiết sẽ được ẩn và chỉ được dùng để thống kê. Quý khách có thể từ chối không tham gia bất cứ lúc nào."
      ]
    },
    {
      id: 2,
      icon: <LockIcon className="icon" />,
      title: "Bảo mật",
      content: [
        "Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc mất mát hoặc tiêu hủy hoặc thiệt hại cho thông tin của bạn.",
        "Chúng tôi khuyên quý khách không nên đưa thông tin chi tiết về việc thanh toán với bất kỳ ai bằng e-mail, chúng tôi không chịu trách nhiệm về những mất mát quý khách có thể gánh chịu trong việc trao đổi thông tin của quý khách qua internet hoặc email.",
        "Quý khách tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống website.",
        "Mọi vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.",
        "Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.",
        "Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt Nam và tòa án Việt Nam có thẩm quyền xem xét."
      ]
    },
    {
      id: 3,
      icon: <UserIcon className="icon" />,
      title: "Quyền lợi khách hàng",
      content: [
        "Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong dữ liệu của bạn mà không mất phí.",
        "Bất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị."
      ]
    }
  ];

  const highlightFeatures = [
    {
      icon: <ShieldIcon className="feature-icon" />,
      title: "Bảo vệ dữ liệu",
      description: "Cam kết bảo mật thông tin cá nhân của khách hàng",
      color: "blue"
    },
    {
      icon: <EyeIcon className="feature-icon" />,
      title: "Minh bạch",
      description: "Rõ ràng trong việc thu thập và sử dụng thông tin",
      color: "green"
    },
    {
      icon: <LockIcon className="feature-icon" />,
      title: "An toàn",
      description: "Áp dụng các biện pháp bảo mật tiên tiến",
      color: "purple"
    }
  ];

  return (
    // <div className="policy-page">
    //   Hero Section
    //   <div className="hero-section">
    //     <div className="hero-content">
    //       <div className="hero-icon">
    //         <ShieldIcon className="hero-shield-icon" />
    //       </div>
    //       <h1 className="hero-title">Chính sách bảo mật</h1>
    //       <p className="hero-description">
    //         Cám ơn quý khách đã quan tâm và truy cập vào website. Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của Quý khách.
    //       </p>
    //     </div>
    //   </div>

    //   {/* Features Section */}
    //   <div className="features-section">
    //     <div className="container">
    //       <div className="features-grid">
    //         {highlightFeatures.map((feature, index) => (
    //           <div key={index} className={`feature-card feature-${feature.color}`}>
    //             <div className="feature-icon-wrapper">
    //               {feature.icon}
    //             </div>
    //             <h3 className="feature-title">{feature.title}</h3>
    //             <p className="feature-description">{feature.description}</p>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Introduction */}
    //   <div className="intro-section">
    //     <div className="container">
    //       <div className="intro-card">
    //         <h2 className="intro-title">Cam kết của chúng tôi</h2>
    //         <div className="intro-content">
    //           <p>
    //             Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của Quý khách.
    //           </p>
    //           <p>
    //             Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung của Chính sách bảo mật. Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán.
    //           </p>
    //           <p>
    //             Chúng tôi sẽ giữ thông tin của khách hàng trong thời gian luật pháp quy định hoặc cho mục đích nào đó. Quý khách có thể truy cập vào website và trình duyệt mà không cần phải cung cấp chi tiết cá nhân. Lúc đó, Quý khách đang ẩn danh và chúng tôi không thể biết bạn là ai nếu Quý khách không đăng nhập vào tài khoản của mình.
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Policy Sections */}
    //   <div className="policy-sections">
    //     <div className="container">
    //       <h2 className="sections-title">Chi tiết chính sách</h2>
          
    //       <div className="sections-list">
    //         {policyData.map((section, index) => (
    //           <div key={section.id} className="policy-section">
    //             <button
    //               onClick={() => toggleSection(index)}
    //               className="section-header"
    //             >
    //               <div className="section-header-left">
    //                 <div className="section-icon">
    //                   {section.icon}
    //                 </div>
    //                 <h3 className="section-title">
    //                   {index + 1}. {section.title}
    //                 </h3>
    //               </div>
    //               <div className="section-chevron">
    //                 {activeSection === index ? (
    //                   <ChevronDownIcon className="chevron-icon" />
    //                 ) : (
    //                   <ChevronRightIcon className="chevron-icon" />
    //                 )}
    //               </div>
    //             </button>
                
    //             {activeSection === index && (
    //               <div className="section-content">
    //                 <div className="section-content-inner">
    //                   {section.content.map((paragraph, pIndex) => (
    //                     <p key={pIndex} className="section-paragraph">
    //                       {paragraph}
    //                     </p>
    //                   ))}
    //                 </div>
    //               </div>
    //             )}
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Contact Section */}
    //   <div className="contact-section">
    //     <div className="container">
    //       <div className="contact-content">
    //         <h2 className="contact-title">Có câu hỏi về chính sách?</h2>
    //         <p className="contact-description">
    //           Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn về chính sách bảo mật.
    //         </p>
    //         <div className="contact-buttons">
    //           <button className="btn btn-primary">Liên hệ hỗ trợ</button>
    //           <button className="btn btn-secondary">Gọi hotline: 1900 6750</button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Footer Note */}
    //   <div className="footer-note">
    //     <div className="container">
    //       <p className="footer-text">
    //         © 2024 Sudes Phone. Chính sách này có hiệu lực từ ngày cập nhật và có thể được thay đổi theo thời gian.
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="policy-page">
      Đây là trang chinh sách bảo mật
    </div>
  );
};

export default PolicyPage;
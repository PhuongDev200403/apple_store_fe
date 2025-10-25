
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AccountPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
      if (!token) {
        console.warn("Không tìm thấy token, người dùng chưa đăng nhập.");
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/wishlist/my-wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Dữ liệu trả về nằm trong response.data.result.items
        const items = response.data?.result?.items || [];
        setWishlist(items);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3">Đang tải danh sách yêu thích...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <main className="bg-light min-vh-100">
        <div className="container py-4">
          <h1 className="h3 fw-bold mb-4">SẢN PHẨM YÊU THÍCH</h1>

          {/* Khi không có sản phẩm */}
          {wishlist.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-heart display-1 text-danger mb-3"></i>
                <h5 className="mb-3">Bạn chưa có sản phẩm yêu thích nào!</h5>
                <p className="text-secondary mb-4">
                  Hãy thêm sản phẩm vào danh sách yêu thích để xem lại sau.
                </p>
                <Link to="/" className="btn btn-dark">
                  <i className="bi bi-arrow-left me-2"></i>
                  Khám phá sản phẩm
                </Link>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {wishlist.map((item) => {
                const pv = item.productVariant;
                return (
                  <div className="col" key={item.id}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="position-relative">
                        <img
                          src={
                            pv.imageUrl
                              ? `http://localhost:8080/uploads/${pv.imageUrl}`
                              : "/default-product.jpg"
                          }
                          className="card-img-top"
                          alt={pv.slug}
                          style={{
                            objectFit: "cover",
                            height: "250px",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                          }}
                        />
                        <button
                          className="btn btn-light position-absolute top-0 end-0 m-2 border-0 rounded-circle"
                          title="Xóa khỏi yêu thích"
                        >
                          <i className="bi bi-heart-fill text-danger fs-5"></i>
                        </button>
                      </div>
                      <div className="card-body text-center">
                        <h6 className="card-title mb-2 text-truncate">
                          {pv.slug.replace(/-/g, " ")}
                        </h6>
                        <p className="text-muted mb-2">
                          {pv.price?.toLocaleString("vi-VN")}₫
                        </p>
                        <Link
                          to={`/product/${pv.id}`}
                          className="btn btn-outline-dark btn-sm"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

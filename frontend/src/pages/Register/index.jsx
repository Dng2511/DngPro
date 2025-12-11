import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postRegister } from "../../services/Api";
import "./register.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // Validate form
            if (!formData.full_name || !formData.email || !formData.password || !formData.phone) {
                setError("Vui lòng điền đầy đủ tất cả các trường");
                setLoading(false);
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError("Email không hợp lệ");
                setLoading(false);
                return;
            }

            // Validate password length
            if (formData.password.length < 6) {
                setError("Mật khẩu phải có ít nhất 6 ký tự");
                setLoading(false);
                return;
            }

            // Validate phone
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
                setError("Số điện thoại không hợp lệ");
                setLoading(false);
                return;
            }

            const response = await postRegister(formData);

            if (response.data.status === "success") {
                setSuccess("Đăng ký thành công! Chuyển hướng đến trang đăng nhập...");
                setFormData({
                    full_name: "",
                    email: "",
                    password: "",
                    phone: "",
                });

                // Redirect về trang login sau 2 giây
                setTimeout(() => {
                    navigate("/Login");
                }, 2000);
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 400) {
                setError("Email này đã được đăng ký");
            } else {
                setError("Có lỗi xảy ra. Vui lòng thử lại");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Đăng Ký</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="full_name">Họ và Tên</label>
                        <input
                            type="text"
                            className="form-control"
                            id="full_name"
                            name="full_name"
                            placeholder="Nhập họ và tên"
                            value={formData.full_name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Nhập email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            placeholder="Nhập số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng Ký"}
                    </button>
                </form>

                <hr />

                <div className="text-center">
                    <p>Đã có tài khoản? <a href="/Login">Đăng nhập tại đây</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;

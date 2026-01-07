import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, postLogin } from "../../services/Api";
import { useDispatch } from "react-redux";
import { SET_CART } from "../../shared/constants/action-type";
import "./login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            if (!email || !password) {
                setError("Email và mật khẩu không được để trống");
                setLoading(false);
                return;
            }

            const response = await postLogin({
                email,
                password
            }, "customer");

            if (response.data.status === "success") {
                setSuccess("Đăng nhập thành công!");
                // Lưu token và user info vào localStorage

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data));
                await getCart().then(({ data }) => { 
                    console.log(data);
                    dispatch({ type: SET_CART, payload: data.data || [] }); 
                });
                navigate("/");
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 404) {
                setError("Tài khoản không tồn tại");
            } else if (err.response?.status === 401) {
                setError("Mật khẩu không chính xác");
            } else {
                setError("Có lỗi xảy ra. Vui lòng thử lại");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Đăng Nhập</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </button>
                </form>

                <hr />

                <div className="text-center">
                    <p>Chưa có tài khoản? <a href="/register">Đăng ký tại đây</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

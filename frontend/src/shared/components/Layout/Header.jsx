import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth";

const Header = () => {
    const navigate = useNavigate();
    const items = useSelector(({ cart }) => cart.items);
    const { user, isLoggedIn, logout } = useAuth();
    const [keyword, setKeyword] = React.useState([]);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const onChangeKeyword = (e) => {
        setKeyword(e.target.value);
    }
    const setPrevent = (e) => {
        e.preventDefault();
        navigate(`/Search?name=${keyword}`)
        setKeyword("");
    }
    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <>
            {/*	Header	*/}
            <div id="header">
                <div className="container">
                    <div className="row">
                        <div id="logo" className="col-lg-3 col-md-3 col-sm-12">
                            <h1><Link to="/"><img
                                className="img-fluid"
                                src="images/logo.png"
                                style={{ height: "50px", width: "auto" }}
                                alt="logo"
                            /></Link></h1>
                        </div>
                        <div id="search" className="col-lg-6 col-md-6 col-sm-12">
                            <form className="form-inline" onSubmit={setPrevent}>
                                <input onChange={onChangeKeyword} className="form-control mt-3" type="search" placeholder="Tìm kiếm" aria-label="Search" value={keyword} />
                                <button className="btn btn-danger mt-3" type="submit">Tìm kiếm</button>
                            </form>
                        </div>
                        <div id="cart" className="col-lg-3 col-md-3 col-sm-12">
                            {isLoggedIn && user ? (
                                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", width: "100%", height: "60px", fontSize: "16px", gap: "10px", position: "relative" }}>
                                    <div style={{ position: "relative" }}>
                                        <img
                                            onClick={() => setShowDropdown(!showDropdown)}
                                            src={`https://ui-avatars.com/api/?name=${user.full_name || 'User'}&background=random`}
                                            alt={user.full_name || "User"}
                                            title={user.full_name || "User"}
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                borderRadius: "50%",
                                                cursor: "pointer",
                                            }}
                                        />
                                        {showDropdown && (
                                            <div style={{
                                                position: "absolute",
                                                top: "100%",
                                                right: "-10px",
                                                left: "auto",
                                                backgroundColor: "white",
                                                border: "1px solid #ddd",
                                                borderRadius: "4px",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                minWidth: "150px",
                                                zIndex: 1000,
                                                marginTop: "8px"
                                            }}>
                                                <Link to="/profile" style={{
                                                    display: "block",
                                                    padding: "10px 15px",
                                                    color: "#333",
                                                    textDecoration: "none",
                                                    borderBottom: "1px solid #eee",
                                                    cursor: "pointer",
                                                    textAlign: "left"
                                                }} onClick={() => setShowDropdown(false)}>
                                                    👤 Trang cá nhân
                                                </Link>
                                                <Link to="/cart" style={{
                                                    display: "block",
                                                    padding: "10px 15px",
                                                    color: "#333",
                                                    textDecoration: "none",
                                                    borderBottom: "1px solid #eee",
                                                    cursor: "pointer",
                                                    textAlign: "left"
                                                }} onClick={() => setShowDropdown(false)}>
                                                    🛒 Giỏ hàng
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        handleLogout();
                                                    }}
                                                    style={{
                                                        display: "block",
                                                        width: "100%",
                                                        padding: "10px 15px",
                                                        color: "#d32f2f",
                                                        background: "none",
                                                        border: "none",
                                                        textAlign: "left",
                                                        cursor: "pointer",
                                                        fontSize: "14px"
                                                    }}
                                                >
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Link className="mt-4 mr-2" to="/login" style={{ display: "inline-flex", alignItems: "center", fontSize: "16px" }}>Đăng nhập</Link>
                            )}
                        </div>
                    </div>
                </div>
                {/* Toggler/collapsibe Button */}
                <button className="navbar-toggler navbar-light" type="button" data-toggle="collapse" data-target="#menu">
                    <span className="navbar-toggler-icon" />
                </button>
            </div>
            {/*	End Header	*/}
        </>
    )
}
export default Header;
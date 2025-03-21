import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!username && !password) {
      setError("");
    }
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // console.log("Dữ liệu gửi đi:", { username, password });

    if (!username || !password) {
      setError("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    if (username.length < 6 || password.length < 6) {
      setError("Tài khoản và mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5146/api/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      sessionStorage.setItem("userId", response.data.userId);
      sessionStorage.setItem("userFullname", response.data.userFullname);
      setLoading(false);
      navigate("/welcome");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err.response ? err.response.data : err);
      setError(
        err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!"
      );
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        className="p-4 shadow-lg login-form bgr-color"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center mb-3 fw-bold text-blue-holo">Đăng nhập</h2>

        {error && (
          <div className="alert alert-danger text-center p-2">{error}</div>
        )}

        <div className="mb-3 text-start">
          <label className="form-label fw-bold">Tên tài khoản</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tài khoản"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3 text-start">
          <label className="form-label fw-bold">Mật khẩu</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="btn position-absolute top-50 end-0 translate-middle-y me-2"
            onClick={() => setShowPassword(!showPassword)}
          ></button>
        </div>

        <button
          type="submit"
          className="btn w-100 fw-bold css-btn"
          disabled={loading}
        >
          {loading ? (
            <div
              className="spinner-border spinner-border-sm"
              role="status"
            ></div>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

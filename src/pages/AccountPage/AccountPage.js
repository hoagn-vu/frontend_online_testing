import React, { useState } from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AccountPage.css";

const dummyAccounts = {
    "Thí sinh": [
        { id: 1, studentId: "SV001", name: "Nguyễn Văn A", dob: "01/01/2000", gender:"Nữ", username: "nguyenvana", status: "active" },
        { id: 2, studentId: "SV002", name: "Trần Thị B", dob: "15/05/2001", gender:"Nữ", username: "tranthib", status: "disabled" },
    ],
    "Giám thị": [
        { id: 3, studentId: "GT001", name: "Lê Văn C", dob: "22/09/1990", gender:"Nữ", username: "levanc", status: "active" },
    ],
    "Quản trị viên": [
        { id: 4, studentId: "QT001", name: "Phạm Thị D", dob: "05/06/1985", gender:"Nữ", username: "phamthid", status: "active" },
    ],
    "Cán bộ phụ trách kỳ thi": [
        { id: 5, studentId: "CB001", name: "Hoàng Văn E", dob: "12/12/1980", gender:"Nữ", username: "hoangvane", status: "active" },
    ],
};

const permissionOptions = [
    "Quản lý kỳ thi",
    "Quản lý ngân hàng câu hỏi",
    "Quản lý đề thi",
    "Quản lý ma trận đề thi",
    "Quản lý phòng thi"
];

const AccountPage = () => {
    const [selectedRole, setSelectedRole] = useState("Thí sinh");
    const [showForm, setShowForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [formData, setFormData] = useState({
        studentId: "",
        name: "",
        dob: "",
        gender: "Nam",
        username: "",
        password: "",
        role: "Thí sinh",
        status: "active",
        permissions: []
    });

    const [passwordData, setPasswordData] = useState({
        role: "Thí sinh",
        newPassword: "",
        confirmPassword: ""
    });

    const handlePermissionChange = (permission) => {
        setFormData((prevData) => {
            const updatedPermissions = prevData.permissions.includes(permission)
                ? prevData.permissions.filter((p) => p !== permission)
                : [...prevData.permissions, permission];

            return { ...prevData, permissions: updatedPermissions };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu thêm mới:", formData);
        setShowForm(false);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        console.log("Cập nhật mật khẩu cho vai trò:", passwordData);
        setShowPasswordForm(false);
    };

    return (
        <div className="account-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumb-container">
                <Link to="/" className="breadcrumb-link">Home</Link>
                <span> / </span>
                <span className="breadcrumb-current">Quản lý tài khoản</span>
            </nav>

            {/* Thanh tìm kiếm + Nút thêm mới + Upload */}
            <div className="account-actions">
                <input type="text" placeholder="Tìm kiếm..." className="search-box" />
                <button className="add-btn" onClick={() => setShowForm(true)}>Thêm mới</button>
                <button className="change-password-btn" onClick={() => setShowPasswordForm(true)}>Đổi mật khẩu</button>
                <button className="upload-btn">Upload File</button>
            </div>

            {/* Dropdown chọn role */}
            <div className="role-selector">
                <label>Chọn loại tài khoản: </label>
                <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
                    <option value="Thí sinh">Thí sinh</option>
                    <option value="Giám thị">Giám thị</option>
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="Cán bộ phụ trách kỳ thi">Cán bộ phụ trách</option>
                </select>
            </div>

            {/* Hiển thị bảng theo vai trò đã chọn */}
            <div className="account-table-container">
                <h5>Danh sách tài khoản {selectedRole}</h5>
                <table className="account-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Mã SV</th>
                            <th>Họ Tên</th>
                            <th>Ngày Sinh</th>
                            <th>Giới tính</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Trạng thái</th>
                            <th>Chỉnh sửa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyAccounts[selectedRole]?.map((account, index) => (
                            <tr key={account.id}>
                                <td>{index + 1}</td>
                                <td>{account.studentId}</td>
                                <td>{account.name}</td>
                                <td>{account.dob}</td>
                                <td>{account.gender}</td>
                                <td>{account.username}</td>
                                <td>******</td>
                                <td>
                                    <select defaultValue={account.status}>
                                        <option value="active">Active</option>
                                        <option value="disabled">Disabled</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="edit-btn"><FaEdit /></button>
                                    <button className="delete-btn"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Form thêm tài khoản */}
            {showForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h3>Thêm tài khoản mới</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Mã:</label>
                            <input type="text" required onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} />

                            <label>Họ Tên:</label>
                            <input type="text" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                            <label>Ngày Sinh:</label>
                            <input type="date" required onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />

                            <label>Giới tính:</label>
                            <select onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>

                            <label>Username:</label>
                            <input type="text" required onChange={(e) => setFormData({ ...formData, username: e.target.value })} />

                            <label>Password:</label>
                            <input type="password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                            <label>Trạng thái:</label>
                            <select onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="active">Active</option>
                                <option value="disabled">Disabled</option>
                            </select>

                            <label>Vai trò:</label>
                            <select onChange={(e) => setFormData({ ...formData, role: e.target.value, permissions: [] })}>
                                <option value="Thí sinh">Thí sinh</option>
                                <option value="Giám thị">Giám thị</option>
                                <option value="Cán bộ phụ trách kỳ thi">Cán bộ phụ trách kỳ thi</option>
                                <option value="Quản trị viên">Quản trị viên</option>
                            </select>

                            {/* Hiển thị phân quyền nếu chọn Cán bộ phụ trách kỳ thi */}
                            {formData.role === "Cán bộ phụ trách kỳ thi" && (
                                <div>
                                    <label>Phân quyền:</label>
                                    {permissionOptions.map((permission) => (
                                        <div key={permission}>
                                            <input
                                                type="checkbox"
                                                value={permission}
                                                onChange={() => handlePermissionChange(permission)}
                                            />
                                            {permission}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button type="submit">Lưu</button>
                            <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Form Đổi mật khẩu */}
            {showPasswordForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h3>Đổi mật khẩu</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <label>Chọn vai trò:</label>
                            <select onChange={(e) => setPasswordData({ ...passwordData, role: e.target.value })}>
                                <option value="Thí sinh">Thí sinh</option>
                                <option value="Giám thị">Giám thị</option>
                                <option value="Cán bộ phụ trách kỳ thi">Cán bộ phụ trách kỳ thi</option>
                                <option value="Quản trị viên">Quản trị viên</option>
                            </select>

                            <label>Mật khẩu mới:</label>
                            <input type="password" required onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />

                            <label>Xác nhận mật khẩu:</label>
                            <input type="password" required onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />

                            <button type="submit">Lưu</button>
                            <button type="button" onClick={() => setShowPasswordForm(false)}>Hủy</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountPage;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AccountPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Chip, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";

const AccountPage = () => {
  const [dummyAccounts, setDummyAccounts] = useState({
    "Thí sinh": [],
    "Giám thị": [],
    "Quản trị viên": [],
    "Cán bộ phụ trách kỳ thi": [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get("/users");
        // response.data.users.forEach((user) => {
        //   if (user.role === "candidate") {
        //     setDummyAccounts((prev) => ({
        //       ...prev,
        //       "Thí sinh": [...prev["Thí sinh"], user],
        //     }));
        //   }
        //   if (user.role === "supervisor") {
        //     setDummyAccounts((prev) => ({
        //       ...prev,
        //       "Giám thị": [...prev["Giám thị"], user],
        //     }));
        //   }
        //   if (user.role === "admin") {
        //     setDummyAccounts((prev) => ({
        //       ...prev,
        //       "Quản trị viên": [...prev["Quản trị viên"], user],
        //     }));
        //   }
        //   if (user.role === "staff") {
        //     setDummyAccounts((prev) => ({
        //       ...prev,
        //       "Cán bộ phụ trách kỳ thi": [
        //         ...prev["Cán bộ phụ trách kỳ thi"],
        //         user,
        //       ],
        //     }));
        //   }
        // });

        const newAccounts = {
          "Thí sinh": [],
          "Giám thị": [],
          "Quản trị viên": [],
          "Cán bộ phụ trách kỳ thi": [],
        };

        response.data.users.forEach((user) => {
          if (user.role === "candidate") {
            newAccounts["Thí sinh"].push(user);
          }
          if (user.role === "supervisor") {
            newAccounts["Giám thị"].push(user);
          }
          if (user.role === "admin") {
            newAccounts["Quản trị viên"].push(user);
          }
          if (user.role === "staff") {
            newAccounts["Cán bộ phụ trách kỳ thi"].push(user);
          }
        });

        setDummyAccounts(newAccounts);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu tài khoản:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedRole, setSelectedRole] = useState("Thí sinh");
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [rows, setRows] = useState(Object.values(dummyAccounts).flat());
  const filteredRows = dummyAccounts[selectedRole] || [];

  const columns = [
    { field: "id", headerName: "#", width: 10 },
    { field: "userCode", headerName: "Mã", minWidth: 130, flex: 0.02 },
    { field: "fullName", headerName: "Họ tên", minWidth: 150, flex: 0.1 },
    { field: "dateOfBirth", headerName: "Ngày sinh", type: "datetime", width: 120, headerAlign: "center",},
    {
      field: "gender",
      headerName: "Giới tính",
      width: 100,
      align: "center", 
      headerAlign: "center",
    },
    { field: "userName", headerName: "username", minWidth: 120 },
    {
      field: "accountStatus",
      headerName: "Trạng thái",
      width: 160,
      renderCell: (params) => (
        <Select
          value={params.row.status || "active"}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
          size="small"
          sx={{
            minWidth: 120, 
            fontSize: "15px", 
            padding: "0px", 
          }}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="disabled">Disabled</MenuItem>
        </Select>
      ),
    },
    // Chỉ hiển thị cột "Nhóm" nếu vai trò là "Thí sinh"
    ...(selectedRole === "Thí sinh"
      ? [
          {
            field: "groupName",
            headerName: "Nhóm",
            width: 180,
            flex: 0.1,
            headerAlign: "center",
            renderCell: (params) => (
              <Box sx={{ 
                display: "flex",
                gap: 0.5,
                flexWrap: "wrap",
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%", 
              }}>
                {params.value?.map((group, index) => (
                  <Chip key={index} label={group} size="small" color="primary" />
                ))}
              </Box>
            ),
          },
        ]
      : []),
    {
      field: "actions",
      headerName: "Thao tác",
      width: 130,
      sortable: false,
      align: "center", 
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const permissionOptions = [
    "Quản lý kỳ thi",
    "Quản lý ngân hàng câu hỏi",
    "Quản lý đề thi",
    "Quản lý ma trận đề thi",
    "Quản lý phòng thi",
  ];
  useEffect(() => {
    // Chuyển đổi object thành mảng
    const mergedRows = Object.values(dummyAccounts).flat();
    setRows(mergedRows);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
    );
  };

  const [formData, setFormData] = useState({
    userCode: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Nam",
    userName: "",
    password: "",
    role: selectedRole,
    status: "active",
    permissions: [],
  });

  const handleAddNew = () => {
    setEditingAccount(null);
    setFormData({
      userCode: "",
      fullName: "",
      dateOfBirth: "",
      gender: "Nam",
      userName: "",
      password: "",
      role: selectedRole,
      status: "active",
      permissions: [],
    });
    setTimeout(() => setShowForm(true), 0);
  };

  const [passwordData, setPasswordData] = useState({
    role: "Thí sinh",
    newPassword: "",
    confirmPassword: "",
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

  const handleEdit = (account) => {
    setFormData({
      userCode: account.userCode,
      fullName: account.fullName,
      dateOfBirth: account.dateOfBirth,
      gender: account.gender,
      userName: account.userName,
      password: "", 
      role: selectedRole,
      status: account.status,
      permissions: account.permissions || [],
    });
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleDeleteClick = (account) => {
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log(`Đã xóa tài khoản có ID: ${accountToDelete.id}`);
    setShowDeleteModal(false); 
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn xóa?",
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Xóa tài khoản có ID:", id);

        Swal.fire({
          title: "Đã xóa!",
          text: "Tài khoản đã bị xóa.",
          icon: "success",
        });
        setRows(rows.filter((row) => row.id !== id));
      }
    });
  };

  const handleUploadClick = async () => {
    const { value: file } = await Swal.fire({
      title: "Chọn file",
      input: "file",
      inputAttributes: {
        accept: "image/*",
        "aria-label": "Tải ảnh lên",
      },
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: "Tải lên thành công",
          icon: "success",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const colourOptions = [
    { value: "22IT1", label: "22IT1" },
    { value: "22IT2", label: "22IT2" },
    { value: "22IT3", label: "22IT3" },
  ];
  
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  return (
    <div className="account-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb-container">
        <Link to="/" className="breadcrumb-link">
          Home
        </Link>
        <span> / </span>
        <span className="breadcrumb-current">Quản lý tài khoản</span>
      </nav>

      {/* Thanh tìm kiếm + Nút thêm mới + Upload */}
      <div className="account-actions">
        <div className="search-container">
          <SearchBox></SearchBox>
        </div>
        <div className="role-selector">
          <button className="add-btn" onClick={handleAddNew}>
            Thêm mới
          </button>
          <button
            className="change-password-btn"
            onClick={() => setShowPasswordForm(true)}
          >
            Đổi mật khẩu
          </button>
          <button className="upload-btn" onClick={handleUploadClick}>
            Upload File
          </button>
          <button className="btn btn-primary" onClick={() => setShowGroupForm(true)}>
            Thêm nhóm
          </button>
          <button className="btn btn-primary" >
            Xóa nhóm
          </button>
        </div>
      </div>

      {/* Tabs để chọn loại tài khoản */}
      <ul className="nav nav-tabs">
        {Object.keys(dummyAccounts).map((role) => (
          <li className="nav-item" key={role}>
            <a
              className={`nav-link ${selectedRole === role ? "active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleRoleChange(role);
              }}
            >
              {role}
            </a>
          </li>
        ))}
      </ul>

      <div className="account-table-container mt-3">
        <Paper sx={{width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            disableColumnResize 
            disableExtendRowFullWidth
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: "Không có dữ liệu", 
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                whiteSpace: "normal", 
                wordWrap: "break-word", 
                lineHeight: "1.2", 
                padding: "8px", 
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid #ccc", 
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #ddd", 
              },
              "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
                borderBottom: "none", 
              },
              "& .MuiTablePagination-displayedRows": {
                textAlign: "center",        
                marginTop: "16px",
                marginLeft: "0px"
              },
              "& .MuiTablePagination-selectLabel": {
                marginTop: "13px",
                marginLeft: "0px"
              },
              "& .MuiTablePagination-select": {
                marginLeft: "0px",
              } 
            }}
          />
        </Paper>
      </div>

      {/* Form thêm tài khoản */}
      {showForm && (
        <div className="form-overlay">
          <Box
            component="form"
            sx={{
              width: "600px",
              backgroundColor: "white",
              p: 2,
              borderRadius: "8px",
              boxShadow: 3,
              mx: "auto",
            }}
            onSubmit={handleSubmit}
          >
            <p className="text-align fw-bold">
              {editingAccount ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
            </p>

            <Grid container spacing={2}>
              {/* Mã và Họ Tên */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mã"
                  required
                  value={formData.userCode}
                  onChange={(e) =>
                    setFormData({ ...formData, userCode: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>

              {/* Ngày sinh và Giới tính */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ngày Sinh"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Giới tính"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </TextField>
              </Grid>

              {/* Username và Password */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />
              </Grid>

              {/* Trạng thái và Vai trò */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Trạng thái"
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="disabled">Disabled</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Vai trò"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      paddingBottom: "11px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                >
                  <MenuItem value="Thí sinh">Thí sinh</MenuItem>
                  <MenuItem value="Giám thị">Giám thị</MenuItem>
                  <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
                  <MenuItem value="Cán bộ phụ trách kỳ thi">
                    Cán bộ phụ trách kỳ thi
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Phân quyền nếu là Cán bộ phụ trách kỳ thi */}
            {formData.role === "Cán bộ phụ trách kỳ thi" && (
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Phân quyền:
                </label>
                <FormGroup>
                  <Grid container spacing={2}>
                    {permissionOptions.map((permission, index) => (
                      <Grid item xs={6} key={index}>
                        <FormControlLabel
                          sx={{ mb: -3 }}
                          control={
                            <Checkbox
                              checked={formData.permissions.includes(
                                permission
                              )}
                              onChange={(e) => {
                                const updatedPermissions = e.target.checked
                                  ? [...formData.permissions, permission]
                                  : formData.permissions.filter(
                                      (p) => p !== permission
                                    );
                                setFormData({
                                  ...formData,
                                  permissions: updatedPermissions,
                                });
                              }}
                              sx={{ "& .MuiCheckbox-root": { padding: "0px" } }} // Giảm padding checkbox
                            />
                          }
                          label={
                            <span style={{ fontSize: "14px" }}>
                              {permission}
                            </span>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
            )}

            {/* Buttons */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {editingAccount ? "Cập nhật" : "Lưu"}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      )}

      {/* Form Đổi mật khẩu */}
      {showPasswordForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordSubmit}>
              <label>Chọn vai trò:</label>
              <select
                onChange={(e) =>
                  setPasswordData({ ...passwordData, role: e.target.value })
                }
              >
                <option value="Thí sinh">Thí sinh</option>
                <option value="Giám thị">Giám thị</option>
                <option value="Cán bộ phụ trách kỳ thi">
                  Cán bộ phụ trách kỳ thi
                </option>
                <option value="Quản trị viên">Quản trị viên</option>
              </select>

              <label>Mật khẩu mới:</label>
              <input
                type="password"
                required
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />

              <label>Xác nhận mật khẩu:</label>
              <input
                type="password"
                required
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />

              <button type="submit">Lưu</button>
              <button type="button" onClick={() => setShowPasswordForm(false)}>
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Form Chọn nhóm */}
      {showGroupForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>Chọn nhóm</h3>
            <CreatableSelect
              isMulti
              options={colourOptions}
              value={selectedGroups}
              onChange={setSelectedGroups}
            />

            {/* Nút Đóng */}
            <button type="submit">Lưu</button>
            <button type="button" onClick={() => setShowGroupForm(false)}>
              Hủy
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountPage;

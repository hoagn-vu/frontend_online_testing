import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./SesstionPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Chip, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const listQuestionBank = [{
			sessionId: "SESSION001",
			activeAt: "2025-04-10T08:00:00Z",
			sessionStatus: "Active",
			rooms: [
				{
					roomId: "ROOM101",
					supervisorId: "SUP123",
					candidates: [
						{
							candidateId: "CAND001",
							examId: "EXAM123"
						},
						{
							candidateId: "CAND002",
							examId: "EXAM124"
						}
					]
				},
				{
					roomId: "ROOM102",
					supervisorId: "SUP124",
					candidates: [
						{
							candidateId: "CAND003",
							examId: "EXAM125"
						},
						{
							candidateId: "CAND004",
							examId: "EXAM126"
						}
					]
				}
			]
		},
		{
			sessionId: "SESSION002",
			activeAt: "2025-04-10T13:00:00Z",
			sessionStatus: "Disabled",
			rooms: [
				{
					roomId: "ROOM201",
					supervisorId: "SUP125",
					candidates: [
						{
							candidateId: "CAND005",
							examId: "EXAM127"
						},
						{
							candidateId: "CAND006",
							examId: "EXAM128"
						}
					]
				}
			]
		}
	];

const SesstionPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);
	const paginationModel = { page: 0, pageSize: 5 };
	const inputRef = useRef(null);
	const [rows, setRows] = useState(Object.values(listQuestionBank).flat());
	
	const columns = [
		{ field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
		{ 
			field: "sessionId", 
			headerName: "Ca thi", 
			width: 1090, flex: 0.1, 
	// renderCell: (params) => (
	//   <Link 
	//   to={`/admin/exam/${encodeURIComponent(params.row.id)}`} 
	//   style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
	//   >
	//   {params.row.examCode}
	//   </Link>
	// )
		},
		{ 
			field: "activeAt", 
			headerName: "activeAt", 
			width: 160, flex: 0.05,
		},
		{ 
			field: "roomList", 
			headerName: "Phòng thi", 
			width: 150, flex: 0.05,
			renderCell: (params) => (
				<Link 
					to={`/admin/exam/rooms/${params.row.sessionId}`} 
					style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
				>
					Danh sách phòng thi
				</Link>
			)
		},
		{ 
			field: "sessionStatus", 
			headerName: "Trạng thái", 
			width: 145,
			renderCell: (params) => (
				<Select
				value={(params.row.sessionStatus || "Active").toLowerCase()}  
				onChange={(e) => handleStatusChange(params.row.sessionId, e.target.value)}
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
		{
			field: "actions",
			headerName: "Thao tác", align: "center",headerAlign: "center",
			width: 150,
			sortable: false,
			renderCell: (params) => (
				<>
					<IconButton color="primary" onClick={() => handleEdit(params.row)}>
						<EditIcon />
					</IconButton>
					<IconButton color="error" onClick={() => handleDelete(params.row.sessionId)}>
						<DeleteIcon />
					</IconButton>
				</>
			),
		},
	];
	
	useEffect(() => {
		if (showForm && inputRef.current) {
			inputRef.current.focus();
		}
		}, [showForm]);

	const handleStatusChange = (id, newStatus) => {
		Swal.fire({
		title: "Xác nhận thay đổi trạng thái?",
		text: "Bạn có chắc chắn muốn thay đổi trạng thái của ca thi?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Đồng ý",
		cancelButtonText: "Hủy",
		}).then((result) => {
			if (result.isConfirmed) {
				const updatedRows = rows.map((row) =>
					row.sessionId === id ? { ...row, sessionStatus: newStatus } : row
				);
				setRows(updatedRows);
				Swal.fire("Thành công!", "Trạng thái đã được cập nhật.", "success");
			}
		});
	};
	
	const [formData, setFormData] = useState({
	sessionId: "",
	activeAt: "",
	roomList: "",
	sessionStatus: "active",
	});

	const handleAddNew = () => {
	setEditingAccount(null); 
	setFormData({
		sessionId: "",
		activeAt: "",
		roomList: "",
		sessionStatus: "active",
	});
	setTimeout(() => setShowForm(true), 0); 
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Dữ liệu thêm mới:", formData);
		setShowForm(false);
	};

	const handleEdit = (account) => {
		setFormData({
			sessionId: account.sessionId,
			activeAt: account.activeAt,
			sessionStatus: account.sessionStatus,
		});
		setEditingAccount(account);
		setShowForm(true);
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
			setRows(rows.filter((row) => row.sessionId !== id));
			}
		});
	};

	return (
		<div className="exam-management-page">
			{/* Breadcrumb */}
			<nav>
				<Link to="/admin">Home</Link> / 
				<span className="breadcrumb-current">Quản lý kỳ thi</span>
			</nav>
			<div className="account-actions mt-4">
				<div className="search-container">
					<SearchBox></SearchBox>
				</div>
				<button className="add-btn" onClick={handleAddNew}>
					Thêm mới
				</button>
			</div>

			{/* Hiển thị bảng theo vai trò đã chọn */}
			<div className="subject-table-container mt-3">
				<Paper sx={{ width: "100%" }}>
				<DataGrid
					rows={rows}
					columns={columns}
					initialState={{
					pagination: { paginationModel: { page: 0, pageSize: 5 } },
					}}
					pageSizeOptions={[5, 10]}
					disableColumnResize 
					disableExtendRowFullWidth
					disableRowSelectionOnClick
					getRowId={(row) => row.sessionId} 
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
							position: "relative",
							top: "-60px",
						}}
						onSubmit={handleSubmit}
					>
						<p className="text-align fw-bold">
								{editingAccount ? "Chỉnh sửa thông tin ca thi" : "Tạo ca thi"}
						</p>

						<Grid container spacing={2}>										
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Ca thi"
									required
									value={formData.sessionId}
									inputRef={inputRef}
									onChange={(e) =>
									setFormData({ ...formData, sessionId: e.target.value })
									}
									sx={{
										"& .MuiInputBase-input": {
												fontSize: "14px",
												paddingBottom: "11px",
										},
										"& .MuiInputLabel-root": { fontSize: "14px" },
									}}
								/>
							</Grid>
							<Grid item xs={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DateTimePicker
										label="Active at"
										value={formData.activeAt ? dayjs(formData.activeAt) : null}
										onChange={(newValue) => 
										setFormData({ ...formData, activeAt: newValue ? newValue.toISOString() : "" })
										}
										sx={{
											width: "100%", 
										}}
										slotProps={{
											textField: {
												fullWidth: true,
												sx: {
													"& .MuiInputBase-root": {
															height: "50px", 
															fontSize: "16px",
													},
													"& .MuiInputLabel-root": {
															fontSize: "14px",
													},
												},
											},
										}}
								/>
						</LocalizationProvider>

						</Grid>
							</Grid>		
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
		</div>
	)
}

export default SesstionPage;
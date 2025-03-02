import './App.css';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage/LoginPage';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import DefaultLayout from './layouts/DefaultLayout/DefaultLayout';
import AccountPage from './pages/AccountPage/AccountPage';
import Dashboard from './pages/Dashboard/Dashboard';
import LogPage from './pages/LogPage/LogPage';
import HistoryCandidatePage from './pages/HistoryCandidatePage/HistoryCandidatePage';
import HomeCandidate from './pages/HomeCandidate/HomeCandidate';
import TakeExamPage from './pages/TakeExamPage/TakeExamPage';

function App() {
  return (
    <Router> {/* Thêm BrowserRouter */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
      
      <Routes>
        <Route path="/admin" element={<AdminLayout />} >
          <Route path="accountmanage" element={<AccountPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="log" element={<LogPage />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/thisinh" element={<DefaultLayout />} >
          <Route path="home" element={<HomeCandidate />} />
          <Route path="history" element={<HistoryCandidatePage />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/takexam" element={<TakeExamPage />} />
      </Routes>

    </Router>
  );
}

export default App;

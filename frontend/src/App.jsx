import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import PortalLogin from './pages/PortalLogin';
import EmployeeSignup from './pages/EmployeeSignup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AssessmentPage from './pages/AssessmentPage';
import EmployeeStatus from './pages/EmployeeStatus';
import HRDashboard from './pages/HRDashboard';
import HREmployees from './pages/HREmployees';
import HREmployeeReview from './pages/HREmployeeReview';
import HRProfile from './pages/HRProfile';

export function App() {
  return <BrowserRouter><AuthProvider><AppProvider><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/employee/login" element={<PortalLogin role="employee" />} />
    <Route path="/employee/signup" element={<EmployeeSignup />} />
    <Route element={<ProtectedRoute role="employee" />}>
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/employee/assessment" element={<AssessmentPage />} />
      <Route path="/employee/status" element={<EmployeeStatus />} />
    </Route>
    <Route path="/hr/login" element={<PortalLogin role="hr" />} />
    <Route element={<ProtectedRoute role="hr" />}>
      <Route path="/hr/dashboard" element={<HRDashboard />} />
      <Route path="/hr/employees" element={<HREmployees />} />
      <Route path="/hr/employees/:id" element={<HREmployeeReview />} />
      <Route path="/hr/profile" element={<HRProfile />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AppProvider></AuthProvider></BrowserRouter>;
}

export default App;

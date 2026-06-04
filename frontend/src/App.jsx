import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Common/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CartPage from './pages/CartPage';
import CourseDetail from './pages/CourseDetail';
import LearningDashboard from './pages/LearningDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GALab from './pages/GALab';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Catalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/learning" element={<ProtectedRoute><LearningDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/ga-lab" element={<GALab />} />
      </Routes>
    </>
  );
}

export default App;


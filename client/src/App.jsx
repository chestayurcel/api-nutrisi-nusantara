import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import Gallery from './Gallery';
import Dashboard from './Dashboard';

// Helper: Cek apakah user sudah login (ada data di localStorage)
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user_data'));
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
       <Routes>
          {/* Halaman Publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Halaman Private (Harus Login) */}
          <Route path="/gallery" element={
            <PrivateRoute><Gallery /></PrivateRoute>
          } />
          <Route path="/console" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
       </Routes>
    </Router>
  );
}

export default App;
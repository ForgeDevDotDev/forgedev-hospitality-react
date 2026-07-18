import { Routes, Route, Link, NavLink } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import BookingFlowPage from './pages/BookingFlowPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="brand">🏨 ForgeDev Hospitality</Link>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Buscar</NavLink>
        <NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'active' : ''}>Mis Reservas</NavLink>
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>Admin</NavLink>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/booking" element={<BookingFlowPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import MediaDetailPage from './pages/MediaDetailPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import LoansPage from './pages/LoansPage';
import WishlistPage from './pages/WishlistPage';
import StatsPage from './pages/StatsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnimatedBackground from './components/common/AnimatedBackground';

const PrivateRoutes = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    return user ? <Layout><Outlet /></Layout> : <Navigate to="/login" />;
};

const AppContent = () => {
    return (
        <div className="min-h-screen">
            <AnimatedBackground />
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route element={<PrivateRoutes />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/library" element={<LibraryPage />} />
                        <Route path="/media/:id" element={<MediaDetailPage />} />
                        <Route path="/collections" element={<CollectionsPage />} />
                        <Route path="/collections/:id" element={<CollectionDetailPage />} />
                        <Route path="/loans" element={<LoansPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/stats" element={<StatsPage />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
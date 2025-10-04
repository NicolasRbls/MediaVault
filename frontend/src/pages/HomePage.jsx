import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import MediaCard from '../components/media/MediaCard';

const StatCard = ({ title, value, icon }) => (
    <motion.div 
        whileHover={{ scale: 1.05 }}
        className="bg-base-200/50 backdrop-blur-lg p-6 rounded-lg shadow-lg border border-white/10 flex items-center space-x-4"
    >
        <div className="text-4xl text-primary">{icon}</div>
        <div>
            <h3 className="text-lg font-bold text-base-content/70">{title}</h3>
            <p className="text-4xl font-extrabold text-base-content mt-1">{value}</p>
        </div>
    </motion.div>
);

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentMedia, setRecentMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, mediaRes] = await Promise.all([
                api.get('/stats/overview'),
                api.get('/media?limit=5')
            ]);
            setStats(statsRes.data);
            setRecentMedia(mediaRes.data);
        } catch (error) {
            console.error("Failed to fetch homepage data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome back, <span className="text-gradient-primary">{user?.username}</span>!</h1>
      <p className="text-base-content/70 mb-8">Here's a snapshot of your MediaVault.</p>

      {loading ? (
        <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>
      ) : stats && (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
        >
            <StatCard title="Total Media" value={stats.totalMedia} icon="📚" />
            <StatCard title="Read This Year" value={stats.readThisYear} icon="📖" />
            <StatCard title="Active Loans" value={stats.byStatus.lent || 0} icon="🤝" />
            <StatCard title="In Wishlist" value={stats.byStatus.wishlist || 0} icon="💡" />
        </motion.div>
      )}

      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">Recently Added</h2>
        {!loading && recentMedia.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {recentMedia.map(item => (
                    <MediaCard key={item.id} media={item} />
                ))}
            </div>
        ) : (
            <div className="p-6 bg-base-200/50 backdrop-blur-lg rounded-lg text-center shadow-lg border border-white/10">
                <p className="text-base-content/70">No media added recently. Add some to see them here!</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default HomePage;
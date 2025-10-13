import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import MediaCard from '../components/media/MediaCard';
import { useTranslation } from 'react-i18next';

const StatCard = ({ title, value, icon }) => (
    <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
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
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [recentMedia, setRecentMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Don't set loading to true here to avoid flash on re-fetch
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
    if (user) {
        fetchData();
    }
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">{t('welcome_message', { username: user?.username })}</h1>
      <p className="text-base-content/70 mb-8">{t('app_snapshot')}</p>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" className="text-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard title={t('total_media')} value={stats.totalMedia} icon="📚" />
                  <StatCard title={t('read_this_year')} value={stats.readThisYear} icon="📖" />
                  <StatCard title={t('active_loans')} value={stats.byStatus?.lent || 0} icon="🤝" />
                  <StatCard title={t('in_wishlist')} value={stats.byStatus?.wishlist || 0} icon="💡" />
              </div>
            )}

            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-4">{t('recently_added')}</h2>
              {Array.isArray(recentMedia) && recentMedia.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                      {recentMedia.map(item => (
                          <MediaCard key={item.id} media={item} />
                      ))}
                  </div>
              ) : (
                  <div className="p-6 bg-base-200/50 backdrop-blur-lg rounded-lg text-center shadow-lg border border-white/10">
                      <p className="text-base-content/70">{t('no_media_recently')}</p>
                  </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
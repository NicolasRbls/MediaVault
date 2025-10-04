import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import MediaTypeChart from '../components/dashboard/MediaTypeChart';

const StatCard = ({ title, value, icon }) => (
    <div className="stats shadow bg-base-200">
        <div className="stat">
            <div className="stat-figure text-primary text-3xl">{icon}</div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                setError('Failed to fetch system stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tableau de Bord</h1>
            {loading ? (
                <div className="text-center"><span className="loading loading-spinner"></span></div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : stats && (
                <div className="space-y-8">
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <StatCard title="Utilisateurs" value={stats.totalUsers} icon="👥" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatCard title="Médias" value={stats.totalMedia} icon="📚" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatCard title="Collections" value={stats.totalCollections} icon="📦" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatCard title="Prêts Actifs" value={stats.activeLoans} icon="🤝" />
                        </motion.div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <MediaTypeChart data={stats.byType} />
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Using the colors from our custom theme
const THEME_COLORS = {
    primary: '#8A2BE2',
    secondary: '#00FFFF',
    accent: '#FF00FF',
    green: '#00A67D',
    yellow: '#FFC700',
};

const COLORS = [THEME_COLORS.primary, THEME_COLORS.secondary, THEME_COLORS.accent, THEME_COLORS.yellow, THEME_COLORS.green];

const StatCard = ({ title, value, color }) => (
    <motion.div 
        whileHover={{ scale: 1.05, y: -5 }}
        className="bg-base-200/30 backdrop-blur-lg p-6 rounded-lg border border-base-content/10 shadow-lg"
    >
        <h3 className="text-xl font-bold text-base-content/70">{title}</h3>
        <p className="text-5xl font-extrabold mt-2" style={{ color }}>{value}</p>
    </motion.div>
);

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-neutral/80 backdrop-blur-md border border-white/10 rounded-lg">
                <p className="label text-base-content">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const StatsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        api.get('/stats/overview')
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!stats) return <div className="text-center p-8 text-error">Could not load stats.</div>;

    const pieData = stats ? Object.entries(stats.byType).map(([name, value]) => ({ name: t(name), value })) : [];

    return (
        <div className="p-4 text-base-content">
            <h1 className="text-4xl font-bold mb-8">{t('statistics')}</h1>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate="visible"
            >
                <StatCard title={t('total_media')} value={stats.totalMedia} color={THEME_COLORS.primary} />
                <StatCard title={t('read_this_year')} value={stats.readThisYear} color={THEME_COLORS.secondary} />
                <StatCard title={t('in_wishlist')} value={stats.byStatus.wishlist || 0} color={THEME_COLORS.accent} />
                <StatCard title={t('active_loans')} value={stats.byStatus.lent || 0} color={THEME_COLORS.yellow} />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-neutral/50 backdrop-blur-lg p-6 rounded-lg border border-white/10"
            >
                <h2 className="text-2xl font-bold mb-4">{t('media_distribution_by_type')}</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: 'white' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default StatsPage;
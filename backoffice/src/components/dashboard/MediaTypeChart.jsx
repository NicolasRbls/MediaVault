import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const MediaTypeChart = ({ data }) => {
    const { theme } = useTheme();

    const chartData = Object.entries(data || {}).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count,
    }));

    const isDark = theme === 'dark';
    const barColor = isDark ? '#8884d8' : '#82ca9d';
    const textColor = isDark ? '#A0A0A0' : '#666';

    return (
        <div className="w-full h-80 bg-base-200 p-4 rounded-box shadow-lg">
            <h2 className="text-xl font-bold mb-4">Répartition des Médias par Type</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" tick={{ fill: textColor }} />
                    <YAxis allowDecimals={false} tick={{ fill: textColor }} />
                    <Tooltip 
                        cursor={{fill: 'rgba(120, 120, 120, 0.1)'}}
                        contentStyle={{
                            backgroundColor: isDark ? '#333' : '#fff',
                            border: '1px solid #555'
                        }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Quantité" fill={barColor} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MediaTypeChart;

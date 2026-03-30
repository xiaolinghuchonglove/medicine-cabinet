import { useDrugs } from '../store/DrugContext';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Pill } from 'lucide-react';

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#795548', '#607D8B'];

export default function StatsPage() {
  const { getCategoryStats, getMonthlyExpiredStats, drugs } = useDrugs();

  const categoryStats = getCategoryStats();
  const pieData = Object.entries(categoryStats).map(([name, value]) => ({
    name,
    value
  }));

  const lineData = getMonthlyExpiredStats();

  const totalDrugs = drugs.length;
  const expiredCount = drugs.filter(d => new Date(d.expirationDate) < new Date()).length;
  const expiringSoonCount = drugs.filter(d => {
    const days = Math.ceil((new Date(d.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 30;
  }).length;

  return (
    <div className="page">
      <div className="header">
        <h1>统计图表</h1>
        <p className="subtitle">药品数据分析</p>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-value">{totalDrugs}</span>
          <span className="stat-label">总药品数</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-value">{expiredCount}</span>
          <span className="stat-label">已过期</span>
        </div>
        <div className="stat-card info">
          <span className="stat-value">{expiringSoonCount}</span>
          <span className="stat-label">30天内过期</span>
        </div>
      </div>

      <div className="chart-section">
        <h2>药品类别分布</h2>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">
            <Pill size={32} />
            <p>暂无数据</p>
          </div>
        )}
      </div>

      <div className="chart-section">
        <h2>近12个月过期药品趋势</h2>
        {lineData.some(d => d.count > 0) ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#F44336"
                strokeWidth={2}
                dot={{ fill: '#F44336' }}
                name="过期药品数"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-chart">
            <Pill size={32} />
            <p>暂无过期记录</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Home, Pill, BarChart3, Settings } from 'lucide-react';

export default function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', icon: Home, label: '首页' },
    { id: 'inventory', icon: Pill, label: '库存' },
    { id: 'stats', icon: BarChart3, label: '统计' },
    { id: 'settings', icon: Settings, label: '设置' }
  ];

  return (
    <nav className="tab-bar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <tab.icon size={22} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

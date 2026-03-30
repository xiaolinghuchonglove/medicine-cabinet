import { useState } from 'react';
import { useDrugs } from '../store/DrugContext';
import { Settings, Bell, Tag, Plus, Trash2, Save } from 'lucide-react';

export default function SettingsPage() {
  const { categories, settings, addCategory, removeCategory, updateSettings } = useDrugs();
  const [newCategory, setNewCategory] = useState('');
  const [warningDays, setWarningDays] = useState(settings.expirationWarningDays);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.enabled);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleSaveSettings = () => {
    updateSettings({
      expirationWarningDays: warningDays,
      enabled: notificationsEnabled
    });
    alert('设置已保存');
  };

  return (
    <div className="page">
      <div className="header">
        <h1>设置</h1>
        <p className="subtitle">自定义您的药箱</p>
      </div>

      <div className="settings-section">
        <h2>
          <Bell size={20} />
          有效期提醒设置
        </h2>
        <div className="setting-item">
          <label>提前提醒天数</label>
          <div className="setting-input">
            <input
              type="number"
              min="1"
              max="365"
              value={warningDays}
              onChange={(e) => setWarningDays(parseInt(e.target.value) || 30)}
            />
            <span>天</span>
          </div>
        </div>
        <div className="setting-item">
          <label>启用提醒</label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <button className="save-btn" onClick={handleSaveSettings}>
          <Save size={18} />
          保存设置
        </button>
      </div>

      <div className="settings-section">
        <h2>
          <Tag size={20} />
          分类管理
        </h2>
        <div className="category-list">
          {categories.map(cat => (
            <div key={cat} className="category-item">
              <span>{cat}</span>
              <button onClick={() => removeCategory(cat)} className="delete-btn">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="add-category">
          <input
            type="text"
            placeholder="新分类名称"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button onClick={handleAddCategory}>
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>
          <Settings size={20} />
          关于
        </h2>
        <div className="about-info">
          <p><strong>智能药箱管家</strong></p>
          <p>版本 1.0.0</p>
          <p className="description">
            拍一张药品包装或药盒，AI自动识别药品名称、规格、有效期，生成药品库存，支持手动录入、有效期提醒、用药计划与统计管理。
          </p>
        </div>
      </div>
    </div>
  );
}

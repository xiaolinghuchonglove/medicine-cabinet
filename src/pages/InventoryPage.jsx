import { useState } from 'react';
import { useDrugs } from '../store/DrugContext';
import { Pill, Search, Trash2, Edit, AlertTriangle } from 'lucide-react';

export default function InventoryPage({ onEditDrug }) {
  const { getSortedDrugs, deleteDrug, categories } = useDrugs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const drugs = getSortedDrugs();
  
  const filteredDrugs = drugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.specification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || drug.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getDaysLeft = (dateStr) => {
    const now = new Date();
    const expDate = new Date(dateStr);
    return Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
  };

  const getStatusClass = (dateStr) => {
    const days = getDaysLeft(dateStr);
    if (days < 0) return 'expired';
    if (days <= 30) return 'warning';
    return 'normal';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  const handleDelete = (id, name) => {
    if (confirm(`确定要删除 "${name}" 吗？`)) {
      deleteDrug(id);
    }
  };

  return (
    <div className="page">
      <div className="header">
        <h1>药品库存</h1>
        <p className="subtitle">共 {drugs.length} 种药品</p>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="搜索药品名称或规格..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="category-filter"
        >
          <option value="">全部分类</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="drug-list">
        {filteredDrugs.length === 0 ? (
          <div className="empty-state">
            <Pill size={48} className="empty-icon" />
            <p>{searchTerm || filterCategory ? '没有找到匹配的药品' : '暂无药品'}</p>
          </div>
        ) : (
          filteredDrugs.map(drug => {
            const days = getDaysLeft(drug.expirationDate);
            const statusClass = getStatusClass(drug.expirationDate);
            
            return (
              <div key={drug.id} className={`drug-card ${statusClass}`}>
                <div className="drug-icon">
                  <Pill size={24} />
                </div>
                <div className="drug-info">
                  <h3>{drug.name}</h3>
                  <p className="specification">{drug.specification}</p>
                  <div className="drug-meta">
                    <span className="category-tag">{drug.category}</span>
                    {drug.notes && <span className="notes">{drug.notes}</span>}
                  </div>
                </div>
                <div className="drug-expiry">
                  <div className={`expiry-days ${statusClass}`}>
                    {days < 0 ? (
                      <>
                        <AlertTriangle size={14} />
                        <span>已过期</span>
                      </>
                    ) : (
                      <>
                        <span>{days}</span>
                        <small>天</small>
                      </>
                    )}
                  </div>
                  <p className="expiry-date">{formatDate(drug.expirationDate)}</p>
                </div>
                <div className="drug-actions">
                  <button onClick={() => onEditDrug(drug)} title="编辑">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(drug.id, drug.name)} title="删除" className="delete-btn">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

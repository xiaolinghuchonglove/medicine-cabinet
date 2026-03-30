import { useState } from 'react';
import { useDrugs } from '../store/DrugContext';
import { Plus, AlertTriangle, Pill, Clock, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage({ onAddDrug, onScanDrug }) {
  const { getExpiringDrugs, getExpiredDrugs, settings } = useDrugs();
  const expiringDrugs = getExpiringDrugs();
  const expiredDrugs = getExpiredDrugs();

  const getDaysLeft = (dateStr) => {
    const now = new Date();
    const expDate = new Date(dateStr);
    return Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="page">
      <div className="header">
        <h1>智能药箱管家</h1>
        <p className="subtitle">您的药品管理助手</p>
      </div>

      <div className="quick-actions">
        <button className="action-btn primary" onClick={onAddDrug}>
          <Plus size={24} />
          <span>手动录入</span>
        </button>
        <button className="action-btn secondary" onClick={onScanDrug}>
          <Camera size={24} />
          <span>拍照识别</span>
        </button>
      </div>

      {(expiringDrugs.length > 0 || expiredDrugs.length > 0) && (
        <div className="reminder-section">
          <h2>
            <AlertTriangle size={20} />
            有效期提醒
          </h2>
          
          {expiredDrugs.length > 0 && (
            <div className="reminder-list">
              <h3 className="expired-title">已过期</h3>
              {expiredDrugs.map(drug => (
                <div key={drug.id} className="reminder-item expired">
                  <Pill size={18} />
                  <div className="reminder-info">
                    <span className="drug-name">{drug.name}</span>
                    <span className="drug-spec">{drug.specification}</span>
                  </div>
                  <span className="days-badge danger">已过期</span>
                </div>
              ))}
            </div>
          )}

          {expiringDrugs.length > 0 && (
            <div className="reminder-list">
              <h3 className="expiring-title">即将过期 ({settings.expirationWarningDays}天内)</h3>
              {expiringDrugs.map(drug => {
                const days = getDaysLeft(drug.expirationDate);
                return (
                  <div key={drug.id} className="reminder-item warning">
                    <Pill size={18} />
                    <div className="reminder-info">
                      <span className="drug-name">{drug.name}</span>
                      <span className="drug-spec">{drug.specification}</span>
                    </div>
                    <span className="days-badge">{days}天</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {expiringDrugs.length === 0 && expiredDrugs.length === 0 && (
        <div className="empty-state">
          <Pill size={48} className="empty-icon" />
          <p>药品状态良好</p>
          <span>暂无需要提醒的药品</span>
        </div>
      )}
    </div>
  );
}

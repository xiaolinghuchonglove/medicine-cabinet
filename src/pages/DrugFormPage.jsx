import { useState, useEffect } from 'react';
import { useDrugs } from '../store/DrugContext';
import { ArrowLeft, Save, Camera } from 'lucide-react';

export default function DrugFormPage({ editDrug, onScanDrug, onBack }) {
  const { categories, addDrug, updateDrug } = useDrugs();
  const isEdit = !!editDrug;

  const [formData, setFormData] = useState({
    name: '',
    specification: '',
    category: categories[0] || '',
    expirationDate: '',
    notes: ''
  });

  useEffect(() => {
    if (editDrug) {
      setFormData({
        name: editDrug.name || '',
        specification: editDrug.specification || '',
        category: editDrug.category || categories[0] || '',
        expirationDate: editDrug.expirationDate ? editDrug.expirationDate.split('T')[0] : '',
        notes: editDrug.notes || ''
      });
    }
  }, [editDrug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('请输入药品名称');
      return;
    }
    if (!formData.expirationDate) {
      alert('请选择有效期');
      return;
    }

    const drugData = {
      ...formData,
      expirationDate: new Date(formData.expirationDate).toISOString()
    };

    if (isEdit) {
      updateDrug(editDrug.id, drugData);
    } else {
      addDrug(drugData);
    }
    onBack();
  };

  return (
    <div className="page">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1>{isEdit ? '编辑药品' : '添加药品'}</h1>
      </div>

      {!isEdit && (
        <div className="scan-option">
          <button className="scan-btn" onClick={onScanDrug}>
            <Camera size={24} />
            <span>拍照识别药品</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="drug-form">
        <div className="form-group">
          <label>药品名称 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="如：阿莫西林胶囊"
            required
          />
        </div>

        <div className="form-group">
          <label>规格</label>
          <input
            type="text"
            name="specification"
            value={formData.specification}
            onChange={handleChange}
            placeholder="如：10mg×20片"
          />
        </div>

        <div className="form-group">
          <label>主治类别</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>有效期 *</label>
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>备注</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="如：饭前服用、每日一次"
            rows={3}
          />
        </div>

        <button type="submit" className="submit-btn">
          <Save size={20} />
          {isEdit ? '保存修改' : '添加药品'}
        </button>
      </form>
    </div>
  );
}

import { useState, useRef } from 'react';
import { useDrugs } from '../store/DrugContext';
import { ArrowLeft, Camera, Image, Loader2, Check } from 'lucide-react';

export default function ScanPage({ onBack, onSaveRecognized }) {
  const { categories, addDrug } = useDrugs();
  const [image, setImage] = useState(null);
  const [recognizing, setRecognizing] = useState(false);
  const [recognized, setRecognized] = useState(null);
  const fileInputRef = useRef(null);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result);
        simulateRecognition(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateRecognition = async (imageData) => {
    setRecognizing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const drugNames = ['阿莫西林胶囊', '布洛芬缓释胶囊', '感冒灵颗粒', '维生素C片', '蒙脱石散'];
    const specs = ['10mg×20片', '0.3g×12粒', '10袋/盒', '100片/瓶', '3g×10袋'];
    const notes = ['饭后服用', '每日3次', '睡前服用', '空腹服用', ''];
    
    const randomIndex = Math.floor(Math.random() * drugNames.length);
    
    const today = new Date();
    const expDate = new Date(today.getFullYear() + Math.floor(Math.random() * 3), 
                              Math.floor(Math.random() * 12), 
                              Math.floor(Math.random() * 28) + 1);
    
    setRecognized({
      name: drugNames[randomIndex],
      specification: specs[randomIndex],
      category: categories[0] || '其他',
      expirationDate: expDate.toISOString().split('T')[0],
      notes: notes[randomIndex]
    });
    
    setRecognizing(false);
  };

  const handleSave = () => {
    if (recognized) {
      addDrug({
        ...recognized,
        expirationDate: new Date(recognized.expirationDate).toISOString()
      });
      onSaveRecognized();
    }
  };

  const handleChange = (field, value) => {
    setRecognized(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="page">
      <div className="header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1>拍照识别</h1>
      </div>

      {!image && (
        <div className="scan-capture">
          <div className="capture-options">
            <button className="capture-btn" onClick={handleCapture}>
              <Camera size={32} />
              <span>拍照</span>
            </button>
            <button className="capture-btn" onClick={handleCapture}>
              <Image size={32} />
              <span>相册</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <p className="hint">拍照或选择药品包装图片</p>
        </div>
      )}

      {image && (
        <div className="recognition-result">
          <div className="image-preview">
            <img src={image} alt="药品" />
          </div>

          {recognizing && (
            <div className="recognizing">
              <Loader2 size={32} className="spin" />
              <p>正在识别中...</p>
            </div>
          )}

          {recognized && !recognizing && (
            <div className="result-form">
              <h3>识别结果 - 请确认</h3>
              
              <div className="form-group">
                <label>药品名称</label>
                <input
                  type="text"
                  value={recognized.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>规格</label>
                <input
                  type="text"
                  value={recognized.specification}
                  onChange={(e) => handleChange('specification', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>主治类别</label>
                <select
                  value={recognized.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>有效期</label>
                <input
                  type="date"
                  value={recognized.expirationDate}
                  onChange={(e) => handleChange('expirationDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>备注</label>
                <input
                  type="text"
                  value={recognized.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="如：饭后服用"
                />
              </div>

              <div className="result-actions">
                <button className="retry-btn" onClick={() => { setImage(null); setRecognized(null); }}>
                  重新拍照
                </button>
                <button className="save-btn" onClick={handleSave}>
                  <Check size={20} />
                  保存药品
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

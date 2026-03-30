import { createContext, useContext, useState, useEffect } from 'react';

const DrugContext = createContext();

const DEFAULT_CATEGORIES = [
  '感冒',
  '消化',
  '慢性病',
  '止痛',
  '维生素',
  '外用',
  '其他'
];

const STORAGE_KEY = 'medicine_cabinet_data';
const CATEGORY_KEY = 'medicine_categories';
const SETTINGS_KEY = 'medicine_settings';

export function DrugProvider({ children }) {
  const [drugs, setDrugs] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState({
    expirationWarningDays: 30,
    enabled: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedDrugs = localStorage.getItem(STORAGE_KEY);
      const savedCategories = localStorage.getItem(CATEGORY_KEY);
      const savedSettings = localStorage.getItem(SETTINGS_KEY);

      if (savedDrugs) setDrugs(JSON.parse(savedDrugs));
      if (savedCategories) setCategories(JSON.parse(savedCategories));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDrugs = (newDrugs) => {
    setDrugs(newDrugs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDrugs));
  };

  const addDrug = (drug) => {
    const newDrug = {
      ...drug,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveDrugs([...drugs, newDrug]);
    return newDrug;
  };

  const updateDrug = (id, updates) => {
    const newDrugs = drugs.map(d =>
      d.id === id
        ? { ...d, ...updates, updatedAt: new Date().toISOString() }
        : d
    );
    saveDrugs(newDrugs);
  };

  const deleteDrug = (id) => {
    saveDrugs(drugs.filter(d => d.id !== id));
  };

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      const newCategories = [...categories, category];
      setCategories(newCategories);
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(newCategories));
    }
  };

  const removeCategory = (category) => {
    const newCategories = categories.filter(c => c !== category);
    setCategories(newCategories);
    localStorage.setItem(CATEGORY_KEY, JSON.stringify(newCategories));
  };

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  };

  const getSortedDrugs = () => {
    return [...drugs].sort((a, b) => {
      const aDate = new Date(a.expirationDate);
      const bDate = new Date(b.expirationDate);
      const now = new Date();
      const aDays = Math.ceil((aDate - now) / (1000 * 60 * 60 * 24));
      const bDays = Math.ceil((bDate - now) / (1000 * 60 * 60 * 24));
      return aDays - bDays;
    });
  };

  const getExpiringDrugs = () => {
    const now = new Date();
    const warningMs = settings.expirationWarningDays * 24 * 60 * 60 * 1000;
    return drugs.filter(d => {
      const expDate = new Date(d.expirationDate);
      const daysLeft = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
      return daysLeft <= settings.expirationWarningDays && daysLeft > -30;
    });
  };

  const getExpiredDrugs = () => {
    const now = new Date();
    return drugs.filter(d => new Date(d.expirationDate) < now);
  };

  const getCategoryStats = () => {
    const stats = {};
    drugs.forEach(d => {
      stats[d.category] = (stats[d.category] || 0) + 1;
    });
    return stats;
  };

  const getMonthlyExpiredStats = () => {
    const stats = {};
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      stats[monthKey] = 0;
    }
    
    drugs.forEach(d => {
      const expDate = new Date(d.expirationDate);
      if (expDate < now) {
        const monthKey = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
        if (stats[monthKey] !== undefined) {
          stats[monthKey]++;
        }
      }
    });
    
    return Object.entries(stats)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  return (
    <DrugContext.Provider value={{
      drugs,
      categories,
      settings,
      loading,
      addDrug,
      updateDrug,
      deleteDrug,
      addCategory,
      removeCategory,
      updateSettings,
      getSortedDrugs,
      getExpiringDrugs,
      getExpiredDrugs,
      getCategoryStats,
      getMonthlyExpiredStats
    }}>
      {children}
    </DrugContext.Provider>
  );
}

export const useDrugs = () => {
  const context = useContext(DrugContext);
  if (!context) {
    throw new Error('useDrugs must be used within DrugProvider');
  }
  return context;
};

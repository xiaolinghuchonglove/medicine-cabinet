import { useState } from 'react';
import { DrugProvider } from './store/DrugContext';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import DrugFormPage from './pages/DrugFormPage';
import ScanPage from './pages/ScanPage';
import TabBar from './components/TabBar';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [editDrug, setEditDrug] = useState(null);

  const handleAddDrug = () => {
    setEditDrug(null);
    setShowForm(true);
  };

  const handleScanDrug = () => {
    setShowScan(true);
  };

  const handleEditDrug = (drug) => {
    setEditDrug(drug);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setShowScan(false);
    setEditDrug(null);
  };

  const handleSaveRecognized = () => {
    setShowScan(false);
    setActiveTab('inventory');
  };

  if (showForm) {
    return (
      <DrugFormPage
        editDrug={editDrug}
        onScanDrug={handleScanDrug}
        onBack={handleBack}
      />
    );
  }

  if (showScan) {
    return (
      <ScanPage
        onBack={handleBack}
        onSaveRecognized={handleSaveRecognized}
      />
    );
  }

  return (
    <div className="app">
      <div className="content">
        {activeTab === 'home' && (
          <HomePage
            onAddDrug={handleAddDrug}
            onScanDrug={handleScanDrug}
          />
        )}
        {activeTab === 'inventory' && (
          <InventoryPage onEditDrug={handleEditDrug} />
        )}
        {activeTab === 'stats' && <StatsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <DrugProvider>
      <AppContent />
    </DrugProvider>
  );
}

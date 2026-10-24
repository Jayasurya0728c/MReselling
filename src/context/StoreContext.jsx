import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchStoreSettings } from '../lib/dataService';
import storeConfig from '../config/storeConfig';

const StoreContext = createContext({
  settings: storeConfig,
  refreshSettings: () => {}
});

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(storeConfig);

  const loadSettings = async () => {
    try {
      const data = await fetchStoreSettings();
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (e) {
      console.warn('Could not load dynamic store settings:', e);
    }
  };

  useEffect(() => {
    loadSettings();

    const handleUpdate = () => {
      loadSettings();
    };

    window.addEventListener('nammude_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('nammude_settings_updated', handleUpdate);
    };
  }, []);

  return (
    <StoreContext.Provider value={{ settings, refreshSettings: loadSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

export default StoreContext;

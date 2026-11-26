import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('texnolux_compare');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('texnolux_compare', JSON.stringify(compareList));
  }, [compareList]);

  const toggleCompare = (product) => {
    setCompareList(prev => {
      const exists = prev.some(item => item._id === product._id);
      if (exists) {
        return prev.filter(item => item._id !== product._id);
      }
      if (prev.length >= 4) {
        alert('Taqqoslash uchun ko‘pi bilan 4 ta mahsulot tanlash mumkin');
        return prev;
      }
      return [...prev, product];
    });
  };

  const isInCompare = (productId) => compareList.some(item => item._id === productId);
  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);

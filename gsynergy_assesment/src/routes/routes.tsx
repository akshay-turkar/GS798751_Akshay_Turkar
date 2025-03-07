import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Store from '../components/store/Store';
import Sku from '../components/sku/Sku';
import Planning from '../components/planning/Planning';
import Charts from '../components/charts/Charts';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Store />} />
      <Route path="/sku" element={<Sku />} />
      <Route path="/planning" element={<Planning />} />
      <Route path="/charts" element={<Charts />} />
    </Routes>
  );
};

export default AppRoutes;

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

test('renders AppRoutes component', () => {
  render(
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
});

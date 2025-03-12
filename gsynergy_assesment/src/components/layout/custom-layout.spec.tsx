import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomLayout from './custom-layout';
import { BrowserRouter } from 'react-router-dom';

test('renders CustomLayout component', () => {
  render(
    <BrowserRouter>
      <CustomLayout />
    </BrowserRouter>
  );
  expect(screen.getByAltText(/Logo/i)).toBeInTheDocument();
  expect(screen.getByText(/Data Viewer App/i)).toBeInTheDocument();
});

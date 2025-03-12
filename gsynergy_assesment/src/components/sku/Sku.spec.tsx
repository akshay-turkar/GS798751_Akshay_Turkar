import React from 'react';
import { render, screen } from '@testing-library/react';
import Sku from './Sku';

test('renders Sku component', () => {
  render(<Sku />);
  expect(screen.getByText(/New SKU/i)).toBeInTheDocument();
});

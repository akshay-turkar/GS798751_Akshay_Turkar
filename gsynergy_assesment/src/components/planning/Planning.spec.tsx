import React from 'react';
import { render, screen } from '@testing-library/react';
import Planning from './Planning';

test('renders Planning component', () => {
  render(<Planning />);
  expect(screen.getByText(/Sales Unit/i)).toBeInTheDocument();
});

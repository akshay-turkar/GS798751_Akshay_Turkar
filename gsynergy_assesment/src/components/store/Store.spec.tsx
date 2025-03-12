import React from 'react';
import { render, screen } from '@testing-library/react';
import Store from './Store';

test('renders Store component', () => {
  render(<Store />);
  expect(screen.getByText(/New Store/i)).toBeInTheDocument();
});

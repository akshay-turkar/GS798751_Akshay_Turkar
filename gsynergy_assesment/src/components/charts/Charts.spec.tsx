import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Charts from './Charts';

test('renders Charts component', async () => {
  render(<Charts />);
  expect(screen.getByText(/Select Store/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('combobox')).toBeInTheDocument());
});

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';

import App from './app';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => undefined)),
    );
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <MemoryRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <App />
      </MemoryRouter>,
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render the tool directory', () => {
    const { getAllByText } = render(
      <MemoryRouter
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <App />
      </MemoryRouter>,
    );
    expect(getAllByText('QR code').length).toBeGreaterThan(0);
    expect(getAllByText('Short URL').length).toBeGreaterThan(0);
    expect(getAllByText('Document generator').length).toBeGreaterThan(0);
    expect(getAllByText('PDF tools').length).toBeGreaterThan(0);
  });
});

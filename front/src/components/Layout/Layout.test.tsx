import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Layout from './Layout';

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet">Contenu de la page</div>
}));

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useEffect: vi.fn()
  };
});

// Mock du composant Navbar
vi.mock('../Navbar/Navbar', () => ({
  default: () => <div data-testid="navbar">Navigation</div>
}));

describe('Layout', () => {
  it('affiche le layout avec la navigation et le contenu', () => {
    render(
      <Layout>
        <div data-testid="content">Contenu de la page</div>
      </Layout>
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
}); 
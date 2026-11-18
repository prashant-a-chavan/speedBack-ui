import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { App } from './App';

const mockUseSpeedback = jest.fn();
const mockUseAuth = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Route: ({ element, children }: { element: React.ReactElement; children?: React.ReactNode }) => (
      <>
        {element}
        {children}
      </>
    ),
    Navigate: ({ to }: { to: string }) => <div>Redirect:{to}</div>,
    Outlet: () => <div>Outlet</div>,
    useLocation: () => ({ pathname: '/' }),
  }),
  { virtual: true }
);

jest.mock('./context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('./hooks/useSpeedback.ts', () => ({
  useSpeedback: () => mockUseSpeedback(),
}));

jest.mock('./components/Navbar.tsx', () => ({
  Navbar: () => <div>Navbar</div>,
}));

const mockModal = jest.fn(({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-modal">{children}</div>
));

jest.mock('./components/Modal.tsx', () => ({
  Modal: (props: { children: React.ReactNode; type: string }) => mockModal(props),
}));

jest.mock('./pages/DashboardPage.tsx', () => ({
  DashboardPage: () => <div>Dashboard Page</div>,
}));

jest.mock('./pages/AboutPage.tsx', () => ({
  AboutPage: () => <div>About Page</div>,
}));

jest.mock('./pages/LoginPage.tsx', () => ({
  LoginPage: () => <div>Login Page</div>,
}));

jest.mock('./components/RequireAuth.tsx', () => ({
  RequireAuth: () => <div>RequireAuth</div>,
}));

jest.mock('./services/configService', () => ({
  getFeatureFlags: () => new Promise(() => {}),
}));

describe('App routing', () => {
  const baseHookState = {
    teamMembers: [],
    bookings: [],
    currentMemberId: 1,
    currentMemberName: 'Prashant',
    isModalOpen: true,
    setIsModalOpen: jest.fn(),
    handleBooking: jest.fn(),
    handleRemoveBooking: jest.fn(),
    getAvailableBookies: jest.fn(() => []),
    slotConfig: { count: 3, durationMinutes: 15 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login route in top-level routing', () => {
    mockUseAuth.mockReturnValue({
      session: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUseSpeedback.mockReturnValue({
      ...baseHookState,
      modalMessage: '',
    });

    render(<App />);

    expect(screen.getByText('Login Page')).toBeTruthy();
    expect(screen.getByText('RequireAuth')).toBeTruthy();
  });

  test('keeps protected dashboard modal behavior unchanged', () => {
    mockUseAuth.mockReturnValue({
      session: {
        accessToken: 'token',
        tokenType: 'Bearer',
        expiresInSeconds: 3600,
        memberId: 1,
        name: 'Prashant',
        username: 'Prashant',
      },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUseSpeedback.mockReturnValue({
      ...baseHookState,
      modalMessage: 'Booking Successfully created',
    });

    render(<App />);

    expect(screen.getByText('Dashboard Page')).toBeTruthy();
    expect(mockModal).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import '@testing-library/jest-dom';

import { LoginPage } from './LoginPage';

const mockLogin = jest.fn<Promise<void>, [string, string]>();
const mockUseAuthHook = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    Navigate: () => <div>Navigate</div>,
  }),
  { virtual: true }
);

jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuthHook(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthHook.mockReturnValue({
      session: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: jest.fn(),
    });
  });

  test('submits username and password to login', async () => {
    mockLogin.mockResolvedValue(undefined);

    render(<LoginPage />);

    await userEvent.type(screen.getByLabelText(/username/i), 'Prashant');
    await userEvent.type(screen.getByLabelText(/password/i), 'Prashant@123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('Prashant', 'Prashant@123');
    });
  });
});

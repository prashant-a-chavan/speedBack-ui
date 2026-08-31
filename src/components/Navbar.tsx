import React from 'react';
import { Button, Typography } from '@mui/material';
import { NavbarContainer, NavbarRight, NavLinks, StyledNavLink } from './Navbar.styles.ts';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { session, logout } = useAuth();

  return (
    <NavbarContainer>
      <Typography variant={'h5'} fontWeight={'600'}>
        Speed Back Dashboard
      </Typography>

      <NavbarRight>
        <NavLinks>
          <StyledNavLink to="/">Dashboard</StyledNavLink>
          <StyledNavLink to="/about">About</StyledNavLink>
        </NavLinks>

        <Typography variant="body2" color="text.secondary">
          {session?.name || session?.username}
        </Typography>

        <Button variant="outlined" size="small" onClick={() => logout('/login')}>
          Logout
        </Button>
      </NavbarRight>
    </NavbarContainer>
  );
};

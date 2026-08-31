import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useSpeedback } from './hooks/useSpeedback.ts';
import { Modal } from './components/Modal.tsx';
import { Navbar } from './components/Navbar.tsx';
import { RequireAuth } from './components/RequireAuth.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { AppContainer } from './App.styles.ts';
import { FeatureFlagsProvider } from './context/FeatureFlagsContext';
import { getFeatureFlags } from './services/configService';

const ProtectedApp: React.FC = () => {
  const {
    teamMembers,
    bookings,
    selectedBooker,
    setSelectedBooker,
    isModalOpen,
    setIsModalOpen,
    modalMessage,
    handleBooking,
    handleRemoveBooking,
    getAvailableBookies,
    slotConfig,
  } = useSpeedback();

  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getFeatureFlags()
      .then(setFeatureFlags)
      .catch((err) => console.error('Failed to load feature flags:', err));
  }, []);

  const getModalType = (message: string): 'error' | 'success' | 'info' => {
    if (message.includes('Failed') || message.includes('not available')) {
      return 'error';
    }
    if (message.includes('Successfully')) {
      return 'success';
    }
    return 'info';
  };

  return (
    <FeatureFlagsProvider flags={featureFlags}>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                teamMembers={teamMembers}
                bookings={bookings}
                selectedBooker={selectedBooker}
                setSelectedBooker={setSelectedBooker}
                handleBooking={handleBooking}
                handleRemoveBooking={handleRemoveBooking}
                getAvailableBookies={getAvailableBookies}
                slotConfig={slotConfig}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Booking Information"
          type={getModalType(modalMessage)}
        >
          <p>{modalMessage}</p>
        </Modal>
      </AppContainer>
    </FeatureFlagsProvider>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/*" element={<ProtectedApp />} />
      </Route>
    </Routes>
  );
};

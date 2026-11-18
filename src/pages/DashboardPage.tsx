import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { TeamMember, Booking, SlotConfig } from '../types';
import { Box } from '@mui/material';

interface DashboardPageProps {
  teamMembers: TeamMember[];
  bookings: Booking[];
  currentMemberId: number | null;
  currentMemberName: string;
  handleBooking: (slotNumber: number, bookieId: number) => Promise<void>;
  handleRemoveBooking: (bookerId: number, slotNumber: number) => Promise<void>;
  getAvailableBookies: (currentSlot: number) => TeamMember[];
  slotConfig: SlotConfig;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  teamMembers,
  bookings,
  currentMemberId,
  currentMemberName,
  handleBooking,
  handleRemoveBooking,
  getAvailableBookies,
  slotConfig,
}) => {
  return (
    <Box
      display="flex"
      flexGrow={1}
      overflow="hidden"
      p={3}
      gap={3}
      sx={{ '@media (max-width: 1024px)': { p: 2, gap: 2 } }}
    >
      <Dashboard
        teamMembers={teamMembers}
        bookings={bookings}
        currentMemberId={currentMemberId}
        currentMemberName={currentMemberName}
        onBook={handleBooking}
        onRemove={handleRemoveBooking}
        getAvailableBookies={getAvailableBookies}
        slotConfig={slotConfig}
      />
    </Box>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import {
  getTeamMembers,
  getBookings,
  createBooking,
  removeBooking,
} from '../services/bookingService';
import { getSlotConfiguration } from '../services/configService';
import { useAuth } from '../context/AuthContext';
import useWebSocket from './useWebSocket';
import { TeamMember, Booking, SlotConfig } from '../types';

const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080/ws';

interface UseSpeedbackReturn {
  teamMembers: TeamMember[];
  bookings: Booking[];
  currentMemberId: number | null;
  currentMemberName: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalMessage: string;
  handleBooking: (slotNumber: number, bookieId: number) => Promise<void>;
  handleRemoveBooking: (bookerId: number, slotNumber: number) => Promise<void>;
  getAvailableBookies: (currentSlot: number) => TeamMember[];
  slotConfig: SlotConfig;
}

export const useSpeedback = (): UseSpeedbackReturn => {
  const { session } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slotConfig, setSlotConfig] = useState<SlotConfig>({ count: 3, durationMinutes: 15 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const currentMemberId = session?.memberId ?? null;
  const currentMemberName = session?.name ?? '';

  const handleWebSocketMessage = useCallback((updatedBookings: Booking[]) => {
    setBookings(updatedBookings);
  }, []);

  useWebSocket(WS_URL, handleWebSocketMessage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, bookingsResponse, configResponse] = await Promise.all([
          getTeamMembers(),
          getBookings(),
          getSlotConfiguration(),
        ]);
        setTeamMembers(membersResponse.data);
        setBookings(bookingsResponse.data);
        setSlotConfig(configResponse);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setModalMessage('Failed to load initial data from the server.');
        setIsModalOpen(true);
      }
    };
    fetchData();
  }, []);

  const handleBooking = async (slotNumber: number, bookieId: number) => {
    if (!currentMemberId) {
      setModalMessage('Your session has expired. Please sign in again.');
      setIsModalOpen(true);
      return;
    }

    const bookingData = {
      bookerId: currentMemberId,
      bookieId,
      slotNumber,
    };

    const bookerAlreadyBooked = bookings.find(
      (b) => b.bookieId === bookingData.bookerId && b.slotNumber === bookingData.slotNumber
    );

    if (bookerAlreadyBooked) {
      const bookerWho = teamMembers.find((m) => m.id === bookerAlreadyBooked.bookerId);
      const bookerWhoName = bookerWho ? bookerWho.name : 'another user';
      setModalMessage(
        `You are already booked for slot ${bookingData.slotNumber} by ${bookerWhoName}.`
      );
      setIsModalOpen(true);
      return;
    }

    try {
      await createBooking(bookingData);

      const bookieName =
        teamMembers.find((m) => m.id === bookingData.bookieId)?.name || 'team member';
      setModalMessage(`Successfully booked ${bookieName} for slot ${bookingData.slotNumber}!`);
      setIsModalOpen(true);
    } catch (error: any) {
      const errorMessage = error.response?.data || 'An unexpected error occurred.';
      console.error('Error creating booking:', errorMessage);
      setModalMessage(errorMessage);
      setIsModalOpen(true);
    }
  };

  const handleRemoveBooking = async (bookerId: number, slotNumber: number) => {
    try {
      await removeBooking(bookerId, slotNumber);
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Could not remove the booking.';
      console.error('Error removing booking:', errorMessage);
      setModalMessage(errorMessage);
      setIsModalOpen(true);
    }
  };

  const getAvailableBookies = useCallback(
    (currentSlot: number): TeamMember[] => {
      if (!currentMemberId) return [];

      const bookedByBooker = bookings
        .filter((b) => b.bookerId === currentMemberId)
        .map((b) => b.bookieId);
      const bookedBookiesInSlot = bookings
        .filter((b) => b.slotNumber === currentSlot)
        .map((b) => b.bookieId);
      const bookedBookersInSlot = bookings
        .filter((b) => b.slotNumber === currentSlot)
        .map((b) => b.bookerId);

      return teamMembers.filter(
        (member) =>
          member.id !== currentMemberId &&
          !bookedByBooker.includes(member.id) &&
          !bookedBookiesInSlot.includes(member.id) &&
          !bookedBookersInSlot.includes(member.id)
      );
    },
    [bookings, currentMemberId, teamMembers]
  );

  return {
    teamMembers,
    bookings,
    currentMemberId,
    currentMemberName,
    isModalOpen,
    setIsModalOpen,
    modalMessage,
    handleBooking,
    handleRemoveBooking,
    getAvailableBookies,
    slotConfig,
  };
};

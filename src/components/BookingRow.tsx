import React, { useMemo } from 'react';
import { TeamMember, Booking, SlotConfig } from '../types';
import { TableRow } from '@mui/material';
import { TableCellContent } from './BookingCell.tsx';

interface BookingRowProps {
  member: TeamMember;
  bookings: Booking[];
  currentMemberId: number | null;
  onBook: (slotNumber: number, bookieId: number) => Promise<void>;
  onRemove: (bookerId: number, slotNumber: number) => void;
  getAvailableBookies: (currentSlot: number) => TeamMember[];
  slotConfig: SlotConfig;
}

export const BookingRow: React.FC<BookingRowProps> = ({
  member,
  bookings,
  currentMemberId,
  onBook,
  onRemove,
  getAvailableBookies,
  slotConfig,
}) => {
  const slots = useMemo(() => {
    return Array.from({ length: slotConfig.count }, (_, i) => i + 1);
  }, [slotConfig.count]);

  const getBookingForSlot = (slot: number) => {
    const bookingAsBooker = bookings.find((b) => b.bookerId === member.id && b.slotNumber === slot);
    const bookingAsBookie = bookings.find((b) => b.bookieId === member.id && b.slotNumber === slot);

    return { bookingAsBooker, bookingAsBookie };
  };

  const isCurrentMemberRow = currentMemberId === member.id;

  return (
    <TableRow hover={isCurrentMemberRow}>
      <TableCellContent variant="member" member={member} isCurrentMember={isCurrentMemberRow} />

      {slots.map((slot) => {
        const { bookingAsBooker, bookingAsBookie } = getBookingForSlot(slot);

        return (
          <TableCellContent
            key={slot}
            variant="booking"
            slot={slot}
            bookingAsBooker={bookingAsBooker}
            bookingAsBookie={bookingAsBookie}
            isCurrentMemberRow={isCurrentMemberRow}
            availableBookies={isCurrentMemberRow ? getAvailableBookies(slot) : []}
            onBook={onBook}
            canCancel={isCurrentMemberRow}
            onCancel={onRemove}
          />
        );
      })}
    </TableRow>
  );
};

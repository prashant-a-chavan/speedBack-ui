import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  TableCell,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { Booking, TeamMember } from '../types';
import { useFeatureFlag } from '../context/FeatureFlagsContext';

interface BookingCellProps {
  variant: 'booking';
  slot: number;
  bookingAsBooker?: Booking;
  bookingAsBookie?: Booking;
  isCurrentMemberRow: boolean;
  availableBookies: TeamMember[];
  onBook: (slotNumber: number, bookieId: number) => Promise<void>;
  canCancel: boolean;
  onCancel: (bookerId: number, slotNumber: number) => void;
}

interface BookingMemberNameProps {
  variant: 'member';
  member: TeamMember;
  isCurrentMember: boolean;
}

type TableCellContentProps = BookingCellProps | BookingMemberNameProps;

export const TableCellContent: React.FC<TableCellContentProps> = (props) => {
  const canRemoveBookings = useFeatureFlag('REMOVE_BOOKINGS');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInlineBooking = async (event: SelectChangeEvent<string>) => {
    if (props.variant !== 'booking') {
      return;
    }

    const selectedBookieId = Number(event.target.value);
    if (!selectedBookieId) {
      return;
    }

    try {
      setIsSubmitting(true);
      await props.onBook(props.slot, selectedBookieId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (props.variant === 'member') {
      return (
        <Box>
          <Typography fontWeight={700}>{props.member.name}</Typography>
        </Box>
      );
    }

    const {
      bookingAsBooker,
      bookingAsBookie,
      canCancel,
      onCancel,
      slot,
      isCurrentMemberRow,
      availableBookies,
    } = props;

    if (bookingAsBooker) {
      const showCancelButton = canCancel && canRemoveBookings;

      return (
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="body2" fontWeight={isCurrentMemberRow ? 600 : 500}>
            To: {bookingAsBooker.bookieName}
          </Typography>
          {showCancelButton && (
            <Tooltip title={`Cancel booking with ${bookingAsBooker.bookieName}`}>
              <IconButton
                onClick={() => onCancel(bookingAsBooker.bookerId, slot)}
                size="small"
                aria-label={`Cancel booking with ${bookingAsBooker.bookieName}`}
              >
                <ClearIcon color="error" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      );
    }

    if (bookingAsBookie) {
      return (
        <Typography variant="body2" fontWeight={isCurrentMemberRow ? 600 : 500}>
          From: {bookingAsBookie.bookerName}
        </Typography>
      );
    }

    if (isCurrentMemberRow) {
      return (
        <FormControl sx={{ width: '50%' }} size="small" disabled={isSubmitting || availableBookies.length === 0}>
          <Select
            value=""
            displayEmpty
            onChange={handleInlineBooking}
            renderValue={() => (availableBookies.length === 0 ? 'No teammates available' : 'Book slot')}
            sx={{
              minWidth: 150,
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
              borderRadius: 1.5,
              '& .MuiSelect-select': {
                py: 1,
                fontWeight: 600,
                color: availableBookies.length === 0 ? 'text.disabled' : 'primary.main',
              },
            }}
          >
            <MenuItem value="" disabled>
              <em>Select teammate</em>
            </MenuItem>
            {availableBookies.map((member) => (
              <MenuItem key={member.id} value={String(member.id)}>
                {member.name}
              </MenuItem>
            ))}
          </Select>
          {isSubmitting ? (
            <Box
              position="absolute"
              top="50%"
              right={12}
              sx={{ transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <CircularProgress size={18} />
            </Box>
          ) : null}
        </FormControl>
      );
    }

    return '-';
  };

  const cellStyles: SxProps<Theme> | undefined =
    props.variant === 'member'
      ? {
          color: props.isCurrentMember ? 'text.primary' : 'grey',
          fontWeight: 700,
          backgroundColor: props.isCurrentMember ? 'rgba(25, 118, 210, 0.06)' : 'transparent',
        }
      : {
          opacity: props.isCurrentMemberRow ? 1 : 0.6,
          backgroundColor: props.isCurrentMemberRow
            ? 'rgba(25, 118, 210, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
          transition: 'opacity 0.2s ease, background-color 0.2s ease',
        };

  return <TableCell sx={cellStyles}>{renderContent()}</TableCell>;
};

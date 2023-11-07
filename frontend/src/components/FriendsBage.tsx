import { Typography, useTheme } from '@mui/material';
import { FC } from 'react';

interface FriendsBageProps {
  friendsRequests?: number;
  ml?: number;
}

const FriendsBage: FC<FriendsBageProps> = ({ friendsRequests, ml = 0 }) => {
  const { palette } = useTheme();

  if (!friendsRequests) return null;

  return (
    <Typography
      sx={{
        background: palette.primary.dark,
        color: palette.getContrastText(palette.primary.dark),
        px: 1.3,
        py: 0,
        borderRadius: 5,
        ml,
      }}
    >
      {friendsRequests}
    </Typography>
  );
};

export default FriendsBage;

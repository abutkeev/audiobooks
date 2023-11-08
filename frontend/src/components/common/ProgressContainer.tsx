import { FC, PropsWithChildren } from 'react';
import { Box, BoxProps, CircularProgress, CircularProgressProps, useTheme } from '@mui/material';

export interface ProgressContainerProps {
  progressSize?: number;
  progressColor?: string;
  inProgress?: boolean;
  boxProps?: BoxProps;
  progressProps?: CircularProgressProps;
}

const ProgressContainer: FC<PropsWithChildren<ProgressContainerProps>> = ({
  children,
  progressSize = 24,
  progressColor,
  inProgress,
  boxProps,
  progressProps,
}) => {
  const { palette } = useTheme();

  const { sx: progressSx } = progressProps || {};
  const { sx: boxSx } = boxProps || {};

  return (
    <Box {...boxProps} sx={[...(Array.isArray(boxSx) ? boxSx : [boxSx]), { position: 'relative' }]}>
      {inProgress && (
        <CircularProgress
          {...progressProps}
          size={progressSize}
          sx={[
            {
              position: 'absolute',
              top: '50%',
              left: '50%',
              color: progressColor ?? palette.secondary.main,
              mt: `-${progressSize / 2}px`,
              ml: `-${progressSize / 2}px`,
              zIndex: 1000,
            },
            ...(Array.isArray(progressSx) ? progressSx : [progressSx]),
          ]}
        />
      )}
      {children}
    </Box>
  );
};

export default ProgressContainer;

import React, { useState } from 'react';
import { ButtonProps, Box, Button, CircularProgress, BoxProps, CircularProgressProps, useTheme } from '@mui/material';
import useWaitRefreshing from '../../hooks/useWaitRefreshing';

export interface ProgressButtonProps extends ButtonProps {
  progressSize?: number;
  progressColor?: string;
  inProgress?: boolean;
  boxProps?: BoxProps;
  progressProps?: Omit<CircularProgressProps, ''>;
  refreshing?: boolean;
  onClick?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> | void;
  onEndWait?(): unknown;
}

const ProgressButton: React.FC<ProgressButtonProps> = ({
  children,
  progressSize = 24,
  progressColor,
  inProgress,
  disabled,
  refreshing,
  onClick,
  onEndWait,
  boxProps,
  progressProps,
  sx: buttonSx,
  ...buttonProps
}) => {
  const [processing, setProcessing] = useState(false);
  const setWaitRefreshing = useWaitRefreshing(refreshing, () => {
    setProcessing(false);
    if (onEndWait) {
      onEndWait();
    }
  });
  const { palette } = useTheme();

  const { sx: progressSx } = progressProps || {};

  return (
    <Box {...boxProps}>
      <Button
        {...buttonProps}
        sx={[...(Array.isArray(buttonSx) ? buttonSx : [buttonSx]), { position: 'relative' }]}
        disabled={disabled || inProgress || processing}
        onClick={async e => {
          if (onClick) {
            setProcessing(true);
            try {
              await onClick(e);
            } finally {
              setWaitRefreshing(true);
            }
          }
        }}
      >
        {(inProgress || processing) && (
          <CircularProgress
            {...progressProps}
            size={progressSize}
            sx={[
              ...(Array.isArray(progressSx) ? progressSx : [progressSx]),
              {
                position: 'absolute',
                top: '50%',
                left: '50%',
                color: progressColor ?? palette.secondary.main,
                mt: `-${progressSize / 2}px`,
                ml: `-${progressSize / 2}px`,
                zIndex: 1000,
              },
            ]}
          />
        )}
        {children}
      </Button>
    </Box>
  );
};

export default ProgressButton;

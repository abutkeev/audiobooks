import React, { FC, PropsWithChildren, useState } from 'react';
import { ButtonProps, Button } from '@mui/material';
import useWaitRefreshing from '../../hooks/useWaitRefreshing';
import ProgressContainer from './ProgressContainer';

export interface ProgressButtonProps extends Pick<ButtonProps, 'disabled' | 'variant'> {
  iconButton?: boolean;
  progressSize?: number;
  progressColor?: string;
  inProgress?: boolean;
  refreshing?: boolean;
  onClick?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> | void;
  onEndWait?(): unknown;
  buttonProps?: Omit<ButtonProps, 'onClick' | 'children' | 'disabled' | 'variant'>;
}

const ProgressButton: FC<PropsWithChildren<ProgressButtonProps>> = ({
  disabled,
  variant = 'contained',
  iconButton,
  children,
  progressSize = 24,
  progressColor,
  inProgress,
  refreshing,
  onClick,
  onEndWait,
  buttonProps,
}) => {
  const [processing, setProcessing] = useState(false);
  const setWaitRefreshing = useWaitRefreshing(refreshing, () => {
    setProcessing(false);
    if (onEndWait) {
      onEndWait();
    }
  });

  const handleClick: ButtonProps['onClick'] = async e => {
    if (onClick) {
      setProcessing(true);
      try {
        await onClick(e);
      } finally {
        setWaitRefreshing(true);
      }
    }
  };

  const { sx: ButtonSx } = buttonProps || {};

  return (
    <ProgressContainer inProgress={inProgress || processing} progressColor={progressColor} progressSize={progressSize}>
      <Button
        {...buttonProps}
        sx={[...(Array.isArray(ButtonSx) ? ButtonSx : [ButtonSx]), iconButton && { minWidth: 0, p: 1, borderRadius: '50%' }]}
        disabled={disabled || inProgress || processing}
        variant={iconButton ? 'text' : variant}
        onClick={handleClick}
      >
        {children}
      </Button>
    </ProgressContainer>
  );
};

export default ProgressButton;

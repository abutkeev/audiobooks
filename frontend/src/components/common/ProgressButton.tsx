import React, { FC, PropsWithChildren, useState } from 'react';
import { ButtonProps, Button } from '@mui/material';
import useWaitRefreshing from '../../hooks/useWaitRefreshing';
import ProgressContainer from './ProgressContainer';

export interface ProgressButtonProps extends Pick<ButtonProps, 'disabled' | 'variant'> {
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

  return (
    <ProgressContainer inProgress={inProgress || processing} progressColor={progressColor} progressSize={progressSize}>
      <Button {...buttonProps} disabled={disabled || inProgress || processing} variant={variant} onClick={handleClick}>
        {children}
      </Button>
    </ProgressContainer>
  );
};

export default ProgressButton;

import React, { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { ButtonProps, Button, Tooltip } from '@mui/material';
import useWaitRefreshing from '@/hooks/useWaitRefreshing';
import ProgressContainer from './ProgressContainer';

export interface ProgressButtonProps extends Pick<ButtonProps, 'disabled' | 'variant'> {
  iconButton?: boolean;
  tooltip?: ReactNode;
  progressSize?: number;
  progressColor?: string;
  inProgress?: boolean;
  refreshing?: boolean;
  onClick?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> | void;
  finalAction?(): void;
  buttonProps?: Omit<ButtonProps, 'onClick' | 'children' | 'disabled' | 'variant'>;
}

const ProgressButton: FC<PropsWithChildren<ProgressButtonProps>> = ({
  disabled,
  variant = 'contained',
  iconButton,
  tooltip = '',
  children,
  progressSize = 24,
  progressColor,
  inProgress,
  refreshing,
  onClick,
  finalAction,
  buttonProps,
}) => {
  const [processing, setProcessing] = useState(false);
  const setWaitRefreshing = useWaitRefreshing(refreshing, () => {
    setProcessing(false);
    if (finalAction) {
      finalAction();
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
    <Tooltip title={tooltip}>
      <div>
        <ProgressContainer
          inProgress={inProgress || processing}
          progressColor={progressColor}
          progressSize={progressSize}
        >
          <Button
            {...buttonProps}
            sx={[
              ...(Array.isArray(ButtonSx) ? ButtonSx : [ButtonSx]),
              iconButton && { minWidth: 0, p: 1, borderRadius: '50%' },
            ]}
            disabled={disabled || inProgress || processing}
            variant={iconButton ? 'text' : variant}
            onClick={handleClick}
          >
            {children}
          </Button>
        </ProgressContainer>
      </div>
    </Tooltip>
  );
};

export default ProgressButton;

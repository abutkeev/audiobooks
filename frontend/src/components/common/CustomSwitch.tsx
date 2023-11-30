import React, { FunctionComponent, useState } from 'react';
import { FormControlLabelProps, SwitchProps, Tooltip } from '@mui/material';
import ProgressContainer from './ProgressContainer';
import useWaitRefreshing from '@/hooks/useWaitRefreshing';
import SwitchWithOptionalLabel from './SwitchWithOptionalLabel';

export interface CustomSwitchProps {
  onChange?(value: boolean): void | Promise<void>;
  onClick?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void | Promise<void>;
  onEndWait?(): void;
  inProgress?: boolean;
  refreshing?: boolean;
  progressSize?: number;
  progressColor?: string;
  tooltip?: React.ReactNode;
  label?: FormControlLabelProps['label'];
  checked?: boolean;
  disabled?: boolean;
  switchProps?: Omit<SwitchProps, 'onChange' | 'onClick' | 'checked' | 'value' | 'disabled'>;
}

const CustomSwitch: FunctionComponent<CustomSwitchProps> = ({
  label,
  tooltip = '',
  onChange,
  onClick,
  onEndWait,
  checked,
  inProgress,
  refreshing,
  disabled,
  progressColor,
  progressSize = 24,
  switchProps,
}) => {
  const [processing, setProcessing] = useState(false);
  const setWaitRefreshing = useWaitRefreshing(refreshing, () => {
    setProcessing(false);
    if (onEndWait) {
      onEndWait();
    }
  });

  const handleChange: SwitchProps['onChange'] = async (_, checked) => {
    if (onChange) {
      setProcessing(true);
      try {
        await onChange(checked);
      } finally {
        setWaitRefreshing(true);
      }
    }
  };
  const handleClick: SwitchProps['onClick'] = async e => {
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
    <Tooltip title={tooltip}>
      <div>
        <ProgressContainer
          inProgress={inProgress || processing}
          progressColor={progressColor}
          progressSize={progressSize}
        >
          <SwitchWithOptionalLabel
            {...switchProps}
            label={label}
            disabled={inProgress || processing || disabled}
            checked={checked}
            color='primary'
            onChange={handleChange}
            onClick={handleClick}
          />
        </ProgressContainer>
      </div>
    </Tooltip>
  );
};

export default CustomSwitch;

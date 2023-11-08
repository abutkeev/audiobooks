import { FormControlLabel, Switch, SwitchProps } from '@mui/material';
import { FC, ReactNode } from 'react';

interface SwitchWithOptionalLabelProps extends SwitchProps {
  label?: ReactNode;
}

const SwitchWithOptionalLabel: FC<SwitchWithOptionalLabelProps> = ({ label, ...switchProps }) => {
  if (!label) {
    return <Switch {...switchProps} />;
  }

  return <FormControlLabel control={<Switch {...switchProps} />} label={label} />;
};

export default SwitchWithOptionalLabel;

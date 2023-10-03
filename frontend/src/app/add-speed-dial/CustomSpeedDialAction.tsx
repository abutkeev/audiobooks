import { useContext } from 'react';
import { SpeedDialAction, SpeedDialActionProps, Typography } from '@mui/material';
import { CustomSpeedDialContext } from './CustomSpeedDial';

interface CustomSpeedDialActionProps extends Omit<SpeedDialActionProps, 'tooltipOpen'> {
  tooltipTitle: string;
}

const CustomSpeedDialAction: React.FC<CustomSpeedDialActionProps> = ({
  icon,
  tooltipTitle,
  onClick,
  ...otherProps
}) => {
  const { closeSpeedDial } = useContext(CustomSpeedDialContext);

  const handleClick: SpeedDialActionProps['onClick'] = e => {
    if (onClick) {
      onClick(e);
    }
    closeSpeedDial();
  };

  return (
    <SpeedDialAction
      icon={icon}
      tooltipTitle={<Typography noWrap>{tooltipTitle}</Typography>}
      tooltipOpen
      onClick={handleClick}
      {...otherProps}
    />
  );
};

export default CustomSpeedDialAction;

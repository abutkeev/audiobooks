import { useContext } from 'react';
import { ButtonBase, Card, SpeedDialActionProps, Stack, Typography } from '@mui/material';
import { CustomSpeedDialContext } from './CustomSpeedDial';

interface CustomSpeedDialActionProps {
  open?: boolean;
  icon: React.ReactNode;
  tooltipTitle: string;
  onClick?(): void;
  FabProps?: {
    ref: NonNullable<SpeedDialActionProps['FabProps']>['ref'];
  };
}

const CustomSpeedDialAction: React.FC<CustomSpeedDialActionProps> = ({
  open,
  icon,
  tooltipTitle,
  onClick,
  FabProps: { ref } = {},
}) => {
  const { closeSpeedDial } = useContext(CustomSpeedDialContext);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    closeSpeedDial();
  };

  if (!open) return;

  return (
    <ButtonBase ref={ref} onClick={handleClick} sx={{ justifyContent: 'flex-end' }}>
      <Stack direction='row' alignItems='center' justifyContent='flex-end'>
        <Card raised sx={{ m: 1, mr: 2 }}>
          <Typography noWrap textAlign='end' m={1}>
            {tooltipTitle}
          </Typography>
        </Card>
        {icon}
      </Stack>
    </ButtonBase>
  );
};

export default CustomSpeedDialAction;

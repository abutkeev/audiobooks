import { IconButton, IconButtonProps, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface ControlButtonProps extends Omit<IconButtonProps, 'children' | 'color' | 'size'> {
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  main?: boolean;
  small?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ Icon, main, small, ...iconButtonProps }) => {
  return (
    <IconButton color={main ? 'secondary' : 'primary'} {...iconButtonProps}>
      <Icon sx={{ fontSize: main ? 75 : !small ? 40 : undefined }} />
    </IconButton>
  );
};

export default ControlButton;

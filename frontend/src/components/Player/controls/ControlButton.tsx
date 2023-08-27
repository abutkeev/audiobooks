import { IconButton, IconButtonProps, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface ControlButtonProps extends Omit<IconButtonProps, 'children' | 'color' | 'size'> {
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  main?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ Icon, main, ...iconButtonProps }) => {
  return (
    <IconButton color={main ? 'secondary' : 'primary'} {...iconButtonProps}>
      <Icon sx={{ fontSize: main ? 75 : 40 }} />
    </IconButton>
  );
};

export default ControlButton;

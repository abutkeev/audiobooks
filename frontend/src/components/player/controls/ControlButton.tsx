import { IconButton, IconButtonProps, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface ControlButtonProps extends Omit<IconButtonProps, 'children' | 'color' | 'size'> {
  Icon: OverridableComponent<SvgIconTypeMap>;
  main?: boolean;
  small?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ Icon, main, small, onClick, ...iconButtonProps }) => {
  const handleClick: IconButtonProps['onClick'] = e => {
    e.currentTarget.blur();
    if (!onClick) return;
    onClick(e);
  };

  return (
    <IconButton color={main ? 'secondary' : 'primary'} {...iconButtonProps} onClick={handleClick}>
      <Icon sx={{ fontSize: main ? 75 : !small ? 40 : undefined }} />
    </IconButton>
  );
};

export default ControlButton;

import { FC, MouseEvent, ReactNode, useState } from 'react';
import {
  Badge,
  BadgeProps,
  IconButton,
  IconButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type MenuIconButtonItem =
  | {
      Icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
      icon?: ReactNode;
      title: string;
      action(e: MouseEvent<HTMLLIElement>): void;
    }
  | string
  | false
  | undefined;

export interface MenuIconButtonProps {
  icon: ReactNode;
  items: MenuIconButtonItem[];
  iconButtonProps?: Omit<IconButtonProps, 'children'>;
  menuProps?: Omit<MenuProps, 'anchorEl' | 'open' | 'children'>;
  badgeProps?: BadgeProps;
}

const MenuIconButton: FC<MenuIconButtonProps> = ({ iconButtonProps, icon, items, menuProps, badgeProps }) => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();

  const closeMenu = (e: MouseEvent, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (menuProps?.onClose && e && reason) {
      menuProps.onClose(e, reason);
    }
    setMenuAnchor(undefined);
  };

  const callAndCloseMenu = (action: (e: MouseEvent<HTMLLIElement>) => void) => (e: MouseEvent<HTMLLIElement>) => {
    action(e);
    closeMenu(e);
  };

  const handleIconButtonClick: IconButtonProps['onClick'] = e => {
    setMenuAnchor(e.currentTarget);
    if (iconButtonProps?.onClick) {
      iconButtonProps.onClick(e);
    }
  };

  return (
    <>
      <IconButton color='inherit' {...iconButtonProps} onClick={handleIconButtonClick}>
        <Badge {...badgeProps}>{icon}</Badge>
      </IconButton>
      <Menu {...menuProps} anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu}>
        {items.map((item, index) => {
          if (!item) return null;

          if (typeof item === 'string') {
            return (
              <Typography key={index} mx={2} my={1}>
                {item}
              </Typography>
            );
          }

          const { Icon, icon, title, action } = item;
          return (
            <MenuItem key={index} onClick={callAndCloseMenu(action)}>
              {Icon && (
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
              )}
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText>{title}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default MenuIconButton;

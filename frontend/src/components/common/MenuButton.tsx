import { FC, useState } from 'react';
import ProgressButton, { ProgressButtonProps } from './ProgressButton';
import { Menu, MenuItem, MenuItemProps } from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import useWaitRefreshing from '@/hooks/useWaitRefreshing';
import { useTranslation } from 'react-i18next';

export interface MenuButtonProps extends Omit<ProgressButtonProps, 'children' | 'onClick'> {
  children?: string;
  actions?: {
    title: string;
    onClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>): Promise<void> | void;
  }[];
}

const MenuButton: FC<MenuButtonProps> = ({
  children,
  actions = [],
  inProgress,
  refreshing,
  disabled,
  firstAction,
  finalAction,
  ...progressButtonProps
}) => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const [processing, setProcessing] = useState(false);
  const setWaitRefreshing = useWaitRefreshing(refreshing, () => {
    setProcessing(false);
    if (finalAction) {
      finalAction();
    }
  });
  const { t } = useTranslation();

  const closeMenu = () => setMenuAnchor(undefined);

  const getActionClickHandler =
    (index: number): MenuItemProps['onClick'] =>
    async e => {
      closeMenu();
      if (firstAction) {
        firstAction();
      }

      if (index >= actions.length || index < 0) return;

      setProcessing(true);
      await actions[index].onClick(e);
      setWaitRefreshing(true);
    };

  return (
    <>
      <ProgressButton
        {...progressButtonProps}
        buttonProps={{ endIcon: <KeyboardArrowDown />, ...progressButtonProps.buttonProps }}
        inProgress={inProgress || processing}
        refreshing={refreshing}
        disabled={disabled || actions.length === 0}
        finalAction={finalAction}
        onClick={({ currentTarget }) => setMenuAnchor(currentTarget)}
      >
        {children || t('Actions')}
      </ProgressButton>
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu} MenuListProps={{ sx: { py: 0 } }}>
        {actions.map(({ title }, index) => (
          <MenuItem key={index} onClick={getActionClickHandler(index)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MenuButton;

import { FC, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { Speed } from '@mui/icons-material';
import MenuIconButton, { MenuIconButtonItem } from '@/components/common/MenuIconButton';
import resetFocus from '@/utils/resetFocus';
import { useAppDispatch, useAppSelector } from '@/store';
import { changeSpeed } from '@/store/features/player';

const PlaybackRate: FC = () => {
  const { speed } = useAppSelector(({ player: { state } }) => state);
  const dispatch = useAppDispatch();

  const items = useMemo(
    () =>
      [1, 1.25, 1.5, 1.75, 2]
        .filter(v => v !== speed)
        .map<MenuIconButtonItem>(v => ({
          title: `${v.toFixed(2)}`,
          action: () => {
            dispatch(changeSpeed(v));
            // reset focus to avoid menu activation on space press
            resetFocus();
          },
        })),
    [speed]
  );

  return (
    <MenuIconButton
      icon={
        <Stack direction='row' alignItems='center' spacing={0.3}>
          <Speed color='primary' />
          <Typography color='primary'>{speed.toFixed(2)}</Typography>
        </Stack>
      }
      items={items}
      iconButtonProps={{ disableRipple: true }}
    />
  );
};

export default PlaybackRate;

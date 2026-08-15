import { FC, useState } from 'react';
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { Check, Speed } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import resetFocus from '@/utils/resetFocus';
import { useAppDispatch, useAppSelector } from '@/store';
import { changeSpeed, maxSpeed, minSpeed, speedStep } from '@/store/features/player';

const presets = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const PlaybackRate: FC = () => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
  const { speed } = useAppSelector(({ player: { state } }) => state);
  const dispatch = useAppDispatch();

  const closeMenu = () => {
    setMenuAnchor(undefined);
    // reset focus to avoid menu activation on space press
    resetFocus();
  };

  const selectPreset = (value: number) => () => {
    dispatch(changeSpeed(value));
    closeMenu();
  };

  return (
    <>
      <IconButton color='inherit' disableRipple onClick={e => setMenuAnchor(e.currentTarget)}>
        <Stack direction='row' spacing={0.3} sx={{ alignItems: 'center' }}>
          <Speed color='primary' />
          <Typography color='primary'>{speed.toFixed(2)}</Typography>
        </Stack>
      </IconButton>
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
        {presets.map(value => (
          <MenuItem key={value} selected={value === speed} onClick={selectPreset(value)}>
            <ListItemIcon>{value === speed && <Check fontSize='small' />}</ListItemIcon>
            <ListItemText>{value === 1 ? t('Normal') : value.toFixed(2)}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        {/* MenuList roving focus steals arrow keys from the slider */}
        <Stack component='li' sx={{ px: 3, width: 240 }} onKeyDown={e => e.stopPropagation()}>
          <Typography variant='body2'>
            {t('Custom')}: {speed.toFixed(2)}
          </Typography>
          <Slider
            size='small'
            min={minSpeed}
            max={maxSpeed}
            step={speedStep}
            value={speed}
            onChange={(_, value) => typeof value === 'number' && dispatch(changeSpeed(value))}
          />
        </Stack>
      </Menu>
    </>
  );
};

export default PlaybackRate;

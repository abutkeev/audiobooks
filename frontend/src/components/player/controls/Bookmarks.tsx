import { useState } from 'react';
import { Box, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { Add, Bookmark as BookmarkIcon, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ControlButton from './ControlButton';
import AddBookmarkDialog from './AddBookmarkDialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { showMessage, updateBookState } from '@/store/features/player';
import { useBookmarksGetBookQuery, useBookmarksRemoveMutation } from '@/api/api';
import formatTime from '@/utils/formatTime';
import getErrorMessage from '@/utils/getErrorMessage';

const Bookmarks: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { bookId, chapters } = useAppSelector(({ player }) => player);
  const { data: bookmarks = [] } = useBookmarksGetBookQuery({ bookId }, { skip: !bookId });
  const [remove] = useBookmarksRemoveMutation();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement>();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const closeMenu = () => setMenuAnchor(undefined);

  const handleAddClick = () => {
    closeMenu();
    setShowAddDialog(true);
  };

  const handleSelect = (currentChapter: number, position: number) => {
    dispatch(updateBookState({ bookId, currentChapter, position }));
    closeMenu();
  };

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await remove({ id }).unwrap();
    } catch (err) {
      dispatch(showMessage({ severity: 'error', text: getErrorMessage(err, t('Failed to remove bookmark')) }));
    }
  };

  return (
    <>
      <ControlButton Icon={BookmarkIcon} small onClick={e => setMenuAnchor(e.currentTarget)} />
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
        <MenuItem onClick={handleAddClick}>
          <ListItemIcon>
            <Add color='primary' />
          </ListItemIcon>
          <ListItemText>{t('Add bookmark')}</ListItemText>
        </MenuItem>
        {bookmarks.length > 0 && <Divider />}
        {bookmarks.length === 0 && (
          <MenuItem disabled>
            <Typography variant='body2'>{t('No bookmarks')}</Typography>
          </MenuItem>
        )}
        {bookmarks.map(({ id, name, currentChapter, position }) => (
          <MenuItem key={id} onClick={() => handleSelect(currentChapter, position)}>
            <ListItemText
              primary={name}
              secondary={`${chapters[currentChapter]?.title ?? t('Chapter {{number}}', { number: currentChapter + 1 })} · ${formatTime(position)}`}
            />
            <Box sx={{ ml: 2 }}>
              <IconButton edge='end' size='small' onClick={e => handleRemove(e, id)}>
                <Delete fontSize='small' color='error' />
              </IconButton>
            </Box>
          </MenuItem>
        ))}
      </Menu>
      <AddBookmarkDialog show={showAddDialog} onClose={() => setShowAddDialog(false)} />
    </>
  );
};

export default Bookmarks;

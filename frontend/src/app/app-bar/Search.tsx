import { Clear, Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearchText } from '../../store/features/search';
import { KeyboardEventHandler, useRef } from 'react';

const Search: React.FC = () => {
  const { show, text } = useAppSelector(({ search }) => search);
  const dispatch = useAppDispatch();
  const textfieldRef = useRef<HTMLInputElement>(null);
  const handleKeyDown: KeyboardEventHandler = ({ code }) => {
    if (code === 'Escape') {
      dispatch(setSearchText(''));
      if (textfieldRef.current) {
        textfieldRef.current.blur();
      }
    }
  };
  return (
    show && (
      <TextField
        size='small'
        inputProps={{ ref: textfieldRef }}
        InputProps={{
          sx: theme => ({
            backgroundColor: theme.palette.primary.dark,
            fontSize: theme.typography.body2.fontSize,
            color: theme.palette.getContrastText(theme.palette.primary.dark),
          }),
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon
                sx={theme => ({
                  color: theme.palette.getContrastText(theme.palette.primary.dark),
                })}
              />
            </InputAdornment>
          ),
          endAdornment: text && (
            <InputAdornment position='end' onClick={() => dispatch(setSearchText(''))} sx={{ cursor: 'pointer' }}>
              <Clear
                sx={theme => ({
                  color: theme.palette.getContrastText(theme.palette.primary.dark),
                })}
              />
            </InputAdornment>
          ),
        }}
        value={text}
        onChange={({ target: { value } }) => dispatch(setSearchText(value))}
        onKeyDown={handleKeyDown}
      />
    )
  );
};

export default Search;

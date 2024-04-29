import { Clear, Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSearchText } from '@/store/features/search';
import { KeyboardEventHandler, useEffect, useRef } from 'react';

interface SearchProps {
  hide?(): void;
  fullWidth?: boolean;
}

const Search: React.FC<SearchProps> = ({ hide, fullWidth }) => {
  const { show, text } = useAppSelector(({ search }) => search);
  const dispatch = useAppDispatch();
  const textfieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!textfieldRef.current || text || !hide) return;

    const textfield = textfieldRef.current;

    textfield.addEventListener('blur', hide);
    return () => textfield.removeEventListener('blur', hide);
  }, [text, hide]);

  const handleKeyDown: KeyboardEventHandler = ({ code }) => {
    if (code === 'Escape') {
      dispatch(setSearchText(''));
      if (textfieldRef.current) {
        textfieldRef.current.blur();
      }
      if (hide) {
        hide();
      }
    }
  };

  const handleClearText = () => {
    dispatch(setSearchText(''));
    if (hide) {
      hide();
    }
  };

  return (
    show && (
      <TextField
        name='search'
        aria-label='search'
        autoComplete='off'
        spellCheck={false}
        size='small'
        fullWidth={fullWidth}
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
          endAdornment: (text || hide) && (
            <InputAdornment position='end' onClick={handleClearText} sx={{ cursor: 'pointer' }}>
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

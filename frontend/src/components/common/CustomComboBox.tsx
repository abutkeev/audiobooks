import { Autocomplete, SxProps, TextField } from '@mui/material';
import { useMemo } from 'react';

interface CustomComboBoxProps {
  options: {
    id: string;
    name: string;
  }[];
  label: string;
  value: string;
  setValue(v: string): void;
  sx?: SxProps;
}

const CustomComboBox: React.FC<CustomComboBoxProps> = ({ options, label, value, setValue, sx }) => {
  const autoCompleteOptoons = useMemo(() => options.map(({ id, name: label }) => ({ id, label })), [options]);
  return (
    <Autocomplete
      sx={{ mt: 2, ...sx }}
      options={autoCompleteOptoons}
      renderInput={params => <TextField {...params} label={label} required error={!value} />}
      onChange={(_, v) => setValue(v ? v.id : '')}
      value={autoCompleteOptoons.filter(({ id }) => id === value)[0] || null}
    />
  );
};

export default CustomComboBox;

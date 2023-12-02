import { FC, useMemo, useState } from 'react';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  CircularProgress,
  InputAdornment,
  TextField,
  TextFieldProps,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import useWaitRefreshing from '@/hooks/useWaitRefreshing';

export interface MultiSelectProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'defaultValue'> {
  values: string[];
  list: {
    id: string;
    name: string;
  }[];
  extraOptions?: {
    id: string;
    name: string;
  }[];
  limitTags?: number;
  onChange(values: string[]): void | Promise<unknown>;
  selectOptionsText?: string;
  noOptionsText?: string;
  loading?: boolean;
  loadingText?: string;
  inProgress?: boolean;
  refreshing?: boolean;
}

const MultiSelect: FC<MultiSelectProps> = ({
  values,
  list,
  extraOptions,
  limitTags = 3,
  variant = 'outlined',
  onChange,
  required,
  disabled,
  selectOptionsText,
  noOptionsText,
  loading,
  loadingText,
  inProgress: inProgressProp,
  refreshing,
  ...otherProps
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const error = useMemo(() => {
    if (values.length === 0 && required && !disabled) {
      return t('Mandatory field');
    }

    return null;
  }, [values, required, disabled]);

  const options = useMemo(() => {
    const result = [...list];
    for (const id of values) {
      if (result.some(entry => entry.id === id)) {
        continue;
      }
      const extraEntry = extraOptions?.find(entry => entry.id === id);
      if (extraEntry) {
        result.push(extraEntry);
        continue;
      }
      result.push({ id, name: id });
    }

    return result;
  }, [list, extraOptions, values]);

  const [focus, setFocus] = useState(false);

  const getTextFieldValue = (inputPropsValue: AutocompleteRenderInputParams['inputProps']['value']) => {
    if (loading) {
      if (loadingText) return loadingText;

      return t('Loading...');
    }

    if (values.length === 0 && !focus) {
      if (selectOptionsText) return selectOptionsText;

      return t('Select options');
    }

    return inputPropsValue;
  };

  const [processing, setProcessing] = useState(false);
  const setWaitRefreshing = useWaitRefreshing(refreshing, () => {
    setProcessing(false);
  });

  const handleChange = async (values: string[]) => {
    setProcessing(true);
    try {
      if (onChange) {
        await onChange(values);
      }
    } finally {
      setWaitRefreshing(true);
    }
  };

  const inProgress = inProgressProp || processing;

  return (
    <Autocomplete
      multiple
      limitTags={limitTags}
      openOnFocus
      options={options.map(({ id }) => id)}
      getOptionLabel={option => {
        return options.find(({ id }) => id === option)?.name || `#${option}`;
      }}
      onChange={(_e, values) => handleChange(values)}
      value={values}
      noOptionsText={noOptionsText || t('No options')}
      disabled={disabled || loading || inProgress}
      fullWidth
      renderInput={({ inputProps, InputProps, ...autoSelectProps }) => (
        <TextField
          variant={variant}
          {...(otherProps as TextFieldProps)}
          error={!!error}
          helperText={error}
          required={required}
          {...autoSelectProps}
          onFocus={_ => setFocus(true)}
          onBlur={_ => setFocus(false)}
          inputProps={{
            ...inputProps,
            value: getTextFieldValue(inputProps.value),
          }}
          InputProps={{
            ...InputProps,
            endAdornment:
              loading || inProgress ? (
                <InputAdornment position='end'>
                  <CircularProgress size={theme.typography.fontSize * 1.4} />
                </InputAdornment>
              ) : (
                InputProps.endAdornment
              ),
          }}
        />
      )}
    />
  );
};

export default MultiSelect;

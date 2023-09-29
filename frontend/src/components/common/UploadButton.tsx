import React from 'react';
import { Button, ButtonProps } from '@mui/material';

export interface UploadButtonProps extends Omit<ButtonProps, 'onClick' | 'onChange'> {
  accept?: string;
  multiple?: true;
  onChange(files: File[] | null): void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ accept, onChange, multiple, ...buttonProps }) => {
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <Button {...buttonProps} onClick={() => uploadInputRef.current?.click()} />
      <input
        type='file'
        style={{ display: 'none' }}
        ref={uploadInputRef}
        accept={accept}
        multiple={multiple}
        onClick={e => e.stopPropagation()}
        onChange={({ target }) => {
          try {
            if (!target.files) return;
            onChange([...target.files]);
          } finally {
            target.value = '';
          }
        }}
      />
    </>
  );
};

export default UploadButton;

import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';

interface CustomDialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonProps?: Omit<ButtonProps, 'onClick' | 'children'>;
  cancelButtonProps?: Omit<ButtonProps, 'onClick' | 'children'>;
  onConfirm?: ButtonProps['onClick'];
  onCancel?: ButtonProps['onClick'];
  close?: ButtonProps['onClick'];
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  title,
  content,
  maxWidth = 'sm',
  confirmButtonText,
  cancelButtonText,
  confirmButtonProps,
  cancelButtonProps,
  onConfirm,
  onCancel,
  close,
}) => {
  const { variant: cancelButtonVariant, ...otherCancelButtonProps } = cancelButtonProps || {};
  const { variant: confirmButtonVariant, ...otherConfirmButtonProps } = confirmButtonProps || {};

  const handleCancel: ButtonProps['onClick'] = e => {
    if (onCancel) {
      onCancel(e);
    }
    if (close) {
      close(e);
    }
  };

  const handleConfirm: ButtonProps['onClick'] = e => {
    if (onConfirm) {
      onConfirm(e);
    }
    if (close) {
      close(e);
    }
  };

  return (
    <Dialog open={open} maxWidth={maxWidth} fullWidth onClose={handleCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        {(onCancel || close) && (
          <Button onClick={handleCancel} variant={cancelButtonVariant || 'outlined'} {...otherCancelButtonProps}>
            {cancelButtonText || (onConfirm || onCancel ? 'Cancel' : 'Close')}
          </Button>
        )}
        {onConfirm && (
          <Button onClick={handleConfirm} variant={confirmButtonVariant || 'contained'} {...otherConfirmButtonProps}>
            {confirmButtonText || 'Confirm'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;

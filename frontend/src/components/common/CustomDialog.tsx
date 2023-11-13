import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
} from '@mui/material';
import ProgressButton, { ProgressButtonProps } from './ProgressButton';
import { useTranslation } from 'react-i18next';

interface CustomDialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonProps?: Omit<ProgressButtonProps, 'onClick' | 'children'>;
  cancelButtonProps?: Omit<ButtonProps, 'onClick' | 'children'>;
  onConfirm?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void | Promise<void>;
  onCancel?: ButtonProps['onClick'];
  close?: ButtonProps['onClick'];
  refreshing?: boolean;
  extraButtons?: React.ReactNode;
}

export class AbortOperation {}

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
  refreshing,
  extraButtons,
}) => {
  const { t } = useTranslation();
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

  const handleConfirm: ButtonProps['onClick'] = async e => {
    try {
      if (onConfirm) {
        await onConfirm(e);
      }
      if (close) {
        close(e);
      }
    } catch (e) {
      if (!(e instanceof AbortOperation)) throw e;
    }
  };

  return (
    <Dialog open={open} maxWidth={maxWidth} fullWidth onClose={handleCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Stack direction='row' spacing={1}>
          {extraButtons}
          {(onCancel || close) && (
            <Button onClick={handleCancel} variant={cancelButtonVariant || 'outlined'} {...otherCancelButtonProps}>
              {cancelButtonText || (onConfirm || onCancel ? t('Cancel') : t('Close'))}
            </Button>
          )}
          {onConfirm && (
            <ProgressButton
              onClick={handleConfirm}
              variant={confirmButtonVariant || 'contained'}
              refreshing={refreshing}
              {...otherConfirmButtonProps}
            >
              {confirmButtonText || t('Confirm')}
            </ProgressButton>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;

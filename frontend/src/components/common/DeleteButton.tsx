import React, { FC, MouseEvent, PropsWithChildren, ReactNode } from 'react';
import { Delete } from '@mui/icons-material';
import ProgressButton, { ProgressButtonProps } from './ProgressButton';
import CustomDialog from './CustomDialog';
import { useTranslation } from 'react-i18next';

export interface DeleteButtonProps {
  onConfirm(e: MouseEvent): void | Promise<void>;
  confirmationTitle: string;
  confirmationBody: ReactNode;
  confirmButtonText?: string;
  tooltip?: ReactNode;
  refreshing?: boolean;
  deleteButtonProps?: Omit<ProgressButtonProps, 'onClick' | 'children'>;
}

const DeleteButton: FC<PropsWithChildren<DeleteButtonProps>> = ({
  children,
  onConfirm,
  confirmationTitle,
  confirmationBody,
  confirmButtonText,
  tooltip,
  refreshing,
  deleteButtonProps,
}) => {
  const { t } = useTranslation();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  const handleShowDeleteConfirmationDialog = async (e: MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleConfirm = async (e: MouseEvent) => {
    e.stopPropagation();
    await onConfirm(e);
  };

  const handleClose = (e: MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <ProgressButton
        aria-label='delete button'
        onClick={handleShowDeleteConfirmationDialog}
        iconButton
        tooltip={tooltip ?? t('Delete')}
        {...deleteButtonProps}
      >
        {children ?? <Delete />}
      </ProgressButton>
      <CustomDialog
        open={showDeleteConfirmation}
        title={confirmationTitle}
        content={confirmationBody}
        confirmButtonText={confirmButtonText ?? t('Delete')}
        confirmButtonProps={{ buttonProps: { color: 'error' } }}
        close={handleClose}
        onConfirm={handleConfirm}
        refreshing={refreshing}
      />
    </>
  );
};

export default DeleteButton;

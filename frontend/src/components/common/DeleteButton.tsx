import React, { FC, MouseEvent, PropsWithChildren, ReactNode } from 'react';
import { Delete } from '@mui/icons-material';
import ProgressButton, { ProgressButtonProps } from './ProgressButton';
import CustomDialog from './CustomDialog';

export interface DeleteButtonProps {
  onConfirm(): void | Promise<void>;
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  const handleShowDeleteConfirmationDialog = async (e: MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleConfirm = async (e: MouseEvent) => {
    e.stopPropagation();
    await onConfirm();
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
        tooltip={tooltip}
        {...deleteButtonProps}
      >
        {children ?? <Delete />}
      </ProgressButton>
      <CustomDialog
        open={showDeleteConfirmation}
        title={confirmationTitle}
        content={confirmationBody}
        confirmButtonText={confirmButtonText ?? 'Delete'}
        confirmButtonProps={{ buttonProps: { color: 'error' } }}
        close={handleClose}
        onConfirm={handleConfirm}
        refreshing={refreshing}
      />
    </>
  );
};

export default DeleteButton;

import React, { FC, MouseEvent, PropsWithChildren, ReactNode } from 'react';
import { Delete } from '@mui/icons-material';
import ProgressButton, { ProgressButtonProps } from './ProgressButton';
import CustomDialog from './CustomDialog';

export interface DeleteButtonProps {
  onClick?(): void;
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
  onClick,
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
    if (onClick) {
      await onClick();
    }
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
        close={() => setShowDeleteConfirmation(false)}
        onConfirm={onConfirm}
        refreshing={refreshing}
      />
    </>
  );
};

export default DeleteButton;

import { useState } from 'react';
import useAuthData from '@/hooks/useAuthData';
import { Book, Edit, LibraryBooks, Mic, PersonAdd } from '@mui/icons-material';
import AddPersonDialog from './AddPersonDialog';
import AddSeriesDialog from './AddSeriesDialog';
import AddBookDialog from './AddBookDialog';
import AddUserDialog from './AddUserDialog';
import CustomSpeedDial from './CustomSpeedDial';
import CustomSpeedDialAction from './CustomSpeedDialAction';
import { useTranslation } from 'react-i18next';

const AddSpeedDial: React.FC = () => {
  const { t } = useTranslation();
  const { admin } = useAuthData() || {};
  const [addPersonDialogType, setAddPersonDialogType] = useState<'author' | 'reader'>();
  const [showAddSeriesDialog, setShowAddSeriesDialog] = useState(false);
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);

  if (!admin) return;

  return (
    <>
      <CustomSpeedDial>
        <CustomSpeedDialAction
          icon={<Edit />}
          tooltipTitle={t('Add author')}
          onClick={() => setAddPersonDialogType('author')}
        />
        <CustomSpeedDialAction
          icon={<Mic />}
          tooltipTitle={t('Add reader')}
          onClick={() => setAddPersonDialogType('reader')}
        />
        <CustomSpeedDialAction
          icon={<LibraryBooks />}
          tooltipTitle={t('Add series')}
          onClick={() => setShowAddSeriesDialog(true)}
        />
        <CustomSpeedDialAction
          icon={<Book />}
          tooltipTitle={t('Add book')}
          onClick={() => setShowAddBookDialog(true)}
        />
        <CustomSpeedDialAction
          icon={<PersonAdd />}
          tooltipTitle={t('Add user')}
          onClick={() => setShowAddUserDialog(true)}
        />
      </CustomSpeedDial>
      <AddPersonDialog type={addPersonDialogType} close={() => setAddPersonDialogType(undefined)} />
      <AddSeriesDialog open={showAddSeriesDialog} close={() => setShowAddSeriesDialog(false)} />
      <AddBookDialog open={showAddBookDialog} close={() => setShowAddBookDialog(false)} />
      <AddUserDialog open={showAddUserDialog} close={() => setShowAddUserDialog(false)} />
    </>
  );
};

export default AddSpeedDial;

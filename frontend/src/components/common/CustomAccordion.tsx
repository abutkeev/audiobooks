import { FC, ReactNode, useState } from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpandMore } from '@mui/icons-material';
import ProgressButton from './ProgressButton';

interface CustomAccordionProps {
  summary: ReactNode;
  details: ReactNode;
  modified?: boolean;
  valid?: boolean;
  handleCancel?(): void;
  handleUpdate?(): void | Promise<void>;
}

const CustomAccordion: FC<CustomAccordionProps> = ({
  summary,
  details,
  modified = false,
  valid = false,
  handleCancel,
  handleUpdate,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  return (
    <Accordion
      expanded={expanded || modified}
      onChange={(_, v) => setExpanded(v || modified)}
      sx={[
        modified && {
          '& .MuiAccordionSummary-root:hover, .MuiButtonBase-root:hover': {
            cursor: 'default',
          },
        },
      ]}
    >
      <AccordionSummary expandIcon={<ExpandMore sx={{ visibility: modified ? 'collapse' : 'visible' }} />}>
        {summary}
      </AccordionSummary>
      <AccordionDetails>{details}</AccordionDetails>
      {modified && (
        <AccordionActions>
          <Stack direction='row' spacing={1}>
            {handleCancel && (
              <Button variant='outlined' onClick={handleCancel}>
                {t('Cancel')}
              </Button>
            )}
            {handleUpdate && (
              <ProgressButton disabled={!valid} onClick={handleUpdate}>
                {t('Update')}
              </ProgressButton>
            )}
          </Stack>
        </AccordionActions>
      )}
    </Accordion>
  );
};

export default CustomAccordion;

import React from 'react';
import { Box, CircularProgress, CircularProgressProps, Collapse, Fade } from '@mui/material';

export interface PageLoadingIndicatorProps {
  open: boolean;
  progressProps?: CircularProgressProps;
}

const PageLoadingIndicator: React.FC<PageLoadingIndicatorProps> = ({ open, progressProps }) => {
  const [openDelayed, setOpenDelayed] = React.useState(false);
  React.useEffect(() => {
    if (!openDelayed) {
      const timerId = setTimeout(() => setOpenDelayed(true), 200);
      return () => clearTimeout(timerId);
    }
  }, [open, openDelayed]);
  return (
    <Collapse in={openDelayed && open} unmountOnExit>
      <Fade in={openDelayed && open}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            margin: '24px 0px',
          }}
        >
          <CircularProgress {...progressProps} />
        </Box>
      </Fade>
    </Collapse>
  );
};

export default PageLoadingIndicator;

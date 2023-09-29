import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink, LinkProps } from '@mui/material';
import { forwardRef } from 'react';

const Link: React.FC<Exclude<LinkProps<typeof RouterLink>, 'component'>> = forwardRef(({ ...props }, ref) => (
  <MuiLink component={RouterLink} {...props} ref={ref} />
));

export default Link;

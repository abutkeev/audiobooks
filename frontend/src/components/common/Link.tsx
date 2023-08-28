import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink, LinkProps } from '@mui/material';

const Link: React.FC<Exclude<LinkProps<typeof RouterLink>, 'component'>> = ({ ...props }) => (
  <MuiLink component={RouterLink} {...props} />
);

export default Link;

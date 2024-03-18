import { Link, Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';

interface FooterLinkProps {
  icon: ReactNode;
  href: string;
}

const FooterLink: FC<PropsWithChildren<FooterLinkProps>> = ({ icon, href, children }) => {
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <Typography variant='body2'>{icon}</Typography>
      <Link variant='body2' href={href} target='_blank'>
        {children}
      </Link>
    </Stack>
  );
};

export default FooterLink;

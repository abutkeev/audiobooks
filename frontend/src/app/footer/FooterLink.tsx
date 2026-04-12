import { Link, LinkProps, Stack, Typography } from '@mui/material';
import { FC, PropsWithChildren, ReactNode } from 'react';

interface FooterLinkProps {
  icon: ReactNode;
  href?: string;
  onClick?: LinkProps['onClick'];
}

const FooterLink: FC<PropsWithChildren<FooterLinkProps>> = ({ icon, href, onClick, children }) => {
  return (
    <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
      <Typography variant='body2'>{icon}</Typography>
      <Link variant='body2' href={href} target='_blank' onClick={onClick}>
        {children}
      </Link>
    </Stack>
  );
};

export default FooterLink;

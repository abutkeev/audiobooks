import { Box } from '@mui/material';
import { FC, RefObject, useRef } from 'react';
import useResizeObserver from '@/hooks/useResizeObserver';
import FooterBar from './FooterBar';
import useIsOverlaps from '@/hooks/useIsOverlaps';
import AddSpeedDial from '../add-speed-dial';

interface FooterProps {
  mainRef: RefObject<HTMLElement>;
}

const Footer: FC<FooterProps> = ({ mainRef }) => {
  const [footerBarRef, footerBarEntries] = useResizeObserver<HTMLDivElement>();
  const buttonRef = useRef<HTMLDivElement>(null);
  const buttonOverlaps = useIsOverlaps({ root: mainRef.current, element: buttonRef.current });

  const footerBarHeight = footerBarEntries[0]?.contentRect.height;
  const buttonHeight = buttonRef.current?.getBoundingClientRect().height || 0;
  const marginHeight = footerBarHeight + (buttonOverlaps ? buttonHeight : 0);

  return (
    <>
      <Box height={marginHeight} mt={1} />
      <AddSpeedDial ref={buttonRef} bottom={footerBarHeight} />
      <FooterBar ref={footerBarRef} />
    </>
  );
};

export default Footer;

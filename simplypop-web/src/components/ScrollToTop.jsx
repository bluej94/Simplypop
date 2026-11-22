// ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls the window to the top (x=0, y=0) whenever the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]); // Reruns the effect whenever the path changes

  // This component renders nothing, it only handles the side effect of scrolling.
  return null; 
}
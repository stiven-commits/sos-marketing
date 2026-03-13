import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HashScroll = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    // Let the route render finish before scrolling to the section.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [hash]);

  return null;
};

export default HashScroll;

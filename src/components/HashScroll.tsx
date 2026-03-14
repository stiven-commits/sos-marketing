import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HashScroll = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    // Let the route render finish before scrolling to the section.
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname, hash]);

  return null;
};

export default HashScroll;

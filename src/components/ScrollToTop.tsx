import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTo(0, 0);
        };

        // Immediate scroll
        scrollToTop();

        // Small delay as fallback for async rendering/browser scroll restoration
        const timeoutId = setTimeout(scrollToTop, 10);

        return () => clearTimeout(timeoutId);
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;

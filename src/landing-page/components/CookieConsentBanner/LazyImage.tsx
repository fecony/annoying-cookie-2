import { forwardRef, useState, useRef, useEffect } from "react";

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  placeholderSrc: string;
  src: string;
};

export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  ({ placeholderSrc, src, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState("");
    const placeholderRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setView(src);
          if (placeholderRef.current) {
            observer.unobserve(placeholderRef.current);
          }
        }
      });

      if (placeholderRef.current) {
        observer.observe(placeholderRef.current);
      }

      return () => {
        if (placeholderRef.current) {
          observer.unobserve(placeholderRef.current);
        }
      };
    }, [src]);

    return (
      <>
        {isLoading && (
          <img src={placeholderSrc} ref={placeholderRef} {...props} />
        )}

        <img
          ref={ref}
          src={view}
          style={isLoading ? { display: "none" } : {}}
          onLoad={() => setIsLoading(false)}
          {...props}
        />
      </>
    );
  }
);

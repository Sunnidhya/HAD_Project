import React, { useState, useEffect, useRef } from 'react';

const LazyLoadComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    observer.observe(ref.current);

    // Cleanup function
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return <div ref={ref}>{isVisible && children}</div>;
};

export default LazyLoadComponent;
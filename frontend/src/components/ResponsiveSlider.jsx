import React, { useState, useLayoutEffect, forwardRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ResponsiveSlider = forwardRef(({ children, settings }, ref) => {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (isMobile) {
    return (
      <div>
        {React.Children.map(children, (child, index) => (
          <div key={index} className="mb-4">
            {child}
          </div>
        ))}
      </div>
    );
  }
  return <Slider ref={ref} {...settings}>{children}</Slider>;
});
export default ResponsiveSlider;
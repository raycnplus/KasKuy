import "./styles.css";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";

import { ReactComponent as MongoDBLogo } from "./Logos/MongoDB_White.svg";
import { ReactComponent as NodeLogo } from "./Logos/nodejs-ar21-cropped.svg";
import { ReactComponent as GoogleLogo } from "./Logos/Google.svg";
import { ReactComponent as DockerLogo } from "./Logos/Docker.svg";
import { ReactComponent as FirebaseLogo } from "./Logos/Firebase_Logo.svg";
import { ReactComponent as NextJSLogo } from "./Logos/nextjs-2.svg";
import { ReactComponent as AzureLogo } from "./Logos/azure.svg";
import { ReactComponent as OpenAiLogo } from "./Logos/openAi.svg";
import { ReactComponent as SquareLogo } from "./Logos/square-logo-cropped.svg";
import { ReactComponent as SwiftLogo } from "./Logos/Swift_logo.svg";

function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax">
      <motion.div className="scroller" style={{ x }}>
        <span>
          <motion.div whileHover={{ color: "#000000" }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </span>
        <span>
          <motion.div whileHover={{ color: "#000000" }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </span>
        <span>
          <motion.div whileHover={{ color: "#000000" }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </span>
        <span>
          <motion.div whileHover={{ color: "#FFFFFFFF" }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </span>
      </motion.div>
    </div>
  );
}

const ParallaxLogos = ({ logos, baseVelocity = 100 }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(0, -25, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax">
      <motion.div className="scroller flex-container" style={{ x }}>
        {[...Array(4)].flatMap((_, i) =>
          logos.map((logo, index) => (
            <span key={`${i}-${index}`}>
              <motion.div whileHover={{ color: "#000000" }} transition={{ duration: 0.2 }}>
                {React.cloneElement(logo, { className: "logo-svg" })}
              </motion.div>
            </span>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default function App() {
  const logos = [
    <MongoDBLogo />,
    <NodeLogo />,
    <GoogleLogo />,
    <DockerLogo />,
    <SwiftLogo />,
  ];
  const logos2 = [
    <FirebaseLogo />,
    <NextJSLogo />,
    <AzureLogo />,
    <OpenAiLogo />,
    <SquareLogo />,
  ];
  return (
    <section>
      <ParallaxLogos baseVelocity={-2.5} logos={logos} />
      <ParallaxLogos baseVelocity={2.5} logos={logos2} />
    </section>
  );
}

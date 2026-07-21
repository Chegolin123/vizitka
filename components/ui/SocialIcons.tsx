"use client";

import { motion } from "motion/react";
import { createAnimatedIcon, iconTransition, type IconHandle } from "./AnimatedIcon";

/* ============================ GitHub ============================
   Рисунок контура через pathLength: иконка «проявляется» при hover. */
const GithubIcon = createAnimatedIcon(() => (
  <motion.path
    d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 5 18 5.3 18 5.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"
    variants={{
      normal: { pathLength: 1, opacity: 1 },
      animate: { pathLength: [1, 0, 1], opacity: [1, 0.4, 1] },
    }}
    transition={iconTransition}
  />
));

/* ============================ LinkedIn ============================
   Лёгкий «pop» точки + draw-on остального. */
const LinkedinIcon = createAnimatedIcon(() => (
  <>
    <motion.path
      d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z"
      variants={{
        normal: { pathLength: 1, opacity: 1 },
        animate: { pathLength: [1, 0, 1], opacity: [1, 0.4, 1] },
      }}
      transition={iconTransition}
    />
    <motion.rect
      x={2}
      y={9}
      width={4}
      height={12}
      variants={{
        normal: { opacity: 1 },
        animate: { opacity: [1, 0.4, 1] },
      }}
      transition={iconTransition}
    />
    <motion.circle
      cx={4}
      cy={4}
      r={2}
      variants={{
        normal: { scale: 1 },
        animate: { scale: [1, 1.15, 1] },
      }}
      transition={iconTransition}
    />
  </>
));

/* ============================ Telegram ============================
   «Вылет» бумажного самолетика: translate + slight rotate + opacity. */
const TelegramIcon = createAnimatedIcon(() => (
  <motion.path
    d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.3 13.5l-4.7-1.5c-1-.3-1-1 .2-1.5L20.6 3c.8-.3 1.5.2 1.3 1.3Z"
    fill="currentColor"
    stroke="none"
    variants={{
      normal: { x: 0, y: 0, rotate: 0, opacity: 1 },
      animate: {
        x: [0, 1.5, -1, 0],
        y: [0, -1.5, 0.5, 0],
        rotate: [0, 8, -4, 0],
        opacity: [1, 0.7, 1],
      },
    }}
    transition={iconTransition}
  />
));

/* ============================ Mail ============================
   Конверт: draw-on клапана + лёгкий pulse рамки. */
const MailIcon = createAnimatedIcon(() => (
  <>
    <motion.path
      d="M3 7l9 6 9-6"
      variants={{
        normal: { pathLength: 1, opacity: 1 },
        animate: { pathLength: [1, 0.6, 1], opacity: [1, 0.5, 1] },
      }}
      transition={iconTransition}
    />
    <motion.rect
      x={3}
      y={5}
      width={18}
      height={14}
      rx={2}
      variants={{
        normal: { opacity: 1 },
        animate: { opacity: [1, 0.5, 1] },
      }}
      transition={iconTransition}
    />
  </>
));

/* ============================ Twitter / X ============================
   Draw-on обе диагонали. */
const TwitterIcon = createAnimatedIcon(() => (
  <motion.path
    d="M18.2 2h3.3l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2l7.7-8.8L1.5 2h6.8l4.7 6.2L18.2 2Z"
    variants={{
      normal: { pathLength: 1, opacity: 1 },
      animate: { pathLength: [1, 0, 1], opacity: [1, 0.3, 1] },
    }}
    transition={iconTransition}
  />
));

export {
  GithubIcon,
  LinkedinIcon,
  TelegramIcon,
  MailIcon,
  TwitterIcon,
  type IconHandle,
};

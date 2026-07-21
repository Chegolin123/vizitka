/**
 * Карта «ключ → анимированный компонент иконки».
 *
 * Используется в Hero и Contact: каждая ссылка из lib/content.ts
 * указывает строковый идентификатор иконки; здесь он резолвится в компонент.
 *
 * Все иконки — анимированные (motion), в стиле pqoqubbw/icons:
 * запускаются по hover, имеют императивный handle start/stop.
 */
import {
  GithubIcon,
  LinkedinIcon,
  TelegramIcon,
  MailIcon,
  TwitterIcon,
} from "./SocialIcons";

export const iconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
  email: MailIcon,
  twitter: TwitterIcon,
} as const;

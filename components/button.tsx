import type { ComponentChildren } from "@tabirun/pages/preact";

/** Shared props for all Button variants. */
interface SharedButtonProps {
  children: ComponentChildren;
  onClick?: () => void;
  label?: string;
  size?: "small" | "medium" | "large";
  theme?: "brand" | "default";
}

/** Props for buttons rendered as anchor elements. */
interface AnchorButtonProps extends SharedButtonProps {
  as: "a";
  href: string;
  rel?: string;
  target?: string;
}

/** Props for buttons rendered as button elements. */
interface StandardButtonProps extends SharedButtonProps {
  as?: "button";
  type?: "button" | "submit" | "reset";
}

type ButtonProps = AnchorButtonProps | StandardButtonProps;

/**
 * Polymorphic button component supporting anchor and button variants.
 * Renders as a button by default, or as an anchor when `as="a"`.
 */
export const Button = (props: ButtonProps) => {
  const sharedStyles =
    "cursor-pointer font-bold rounded shadow-lg whitespace-nowrap";
  const themeStyles = THEME_STYLES[props.theme ?? "default"];
  const sizeStyles = SIZE_STYLES[props.size ?? "medium"];
  const styles = `${sharedStyles} ${sizeStyles} ${themeStyles}`;

  if (props.as === "a") {
    return (
      <a
        href={props.href}
        rel={props.rel}
        target={props.target}
        onClick={props.onClick}
        aria-label={props.label}
        className={styles}
      >
        {props.children}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      aria-label={props.label}
      className={styles}
    >
      {props.children}
    </button>
  );
};

const THEME_STYLES = {
  brand:
    "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-400 fill-white",
  default:
    "bg-zinc-100 dark:bg-zinc-100 text-zinc-900 hover:bg-zinc-200 fill-zinc-900",
};

const SIZE_STYLES = {
  small: "p-2 text-sm",
  medium: "p-4 text-base",
  large: "p-6 text-lg",
};

import type { ComponentChildren } from "@tabirun/pages/preact";

/** Shared props for all Link variants. */
interface SharedLinkProps {
  children: ComponentChildren;
  onClick?: () => void;
  label?: string;
  theme?: "brand" | "default";
}

/** Props for button-style links rendered as button elements. */
interface StandardLinkProps extends SharedLinkProps {
  as: "button";
  type?: "button" | "submit" | "reset";
}

/** Props for anchor-style links rendered as anchor elements. */
interface AnchorLinkProps extends SharedLinkProps {
  as?: "a";
  href: string;
  rel?: string;
  target?: string;
}

type LinkProps = AnchorLinkProps | StandardLinkProps;

/**
 * Polymorphic link component supporting anchor and button variants.
 * Renders as an anchor by default, or as a button when `as="button"`.
 */
export const Link = (props: LinkProps) => {
  const sharedStyles = "cursor-pointer underline";
  const themeStyles = THEME_STYLES[props.theme ?? "default"];
  const styles = `${sharedStyles} ${themeStyles}`;

  if (props.as === "button") {
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
  }
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
};

const THEME_STYLES = {
  brand:
    "text-indigo-600 dark:text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 fill-indigo-600 dark:fill-indigo-500 hover:fill-indigo-700 dark:hover:fill-indigo-400",
  default:
    "text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 fill-blue-600 dark:fill-blue-500 hover:fill-blue-700 dark:hover:fill-blue-400",
};

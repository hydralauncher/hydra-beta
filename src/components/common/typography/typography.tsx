import clsx from "clsx";

export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body";
}

export function Typography({
  children,
  variant = "body",
  ...props
}: Readonly<TypographyProps>) {
  const { className, ...rest } = props;

  switch (variant) {
    case "h1":
      return (
        <h1 {...rest} className={clsx("typography typography--h1", className)}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 {...rest} className={clsx("typography typography--h2", className)}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 {...rest} className={clsx("typography typography--h3", className)}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 {...rest} className={clsx("typography typography--h4", className)}>
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 {...rest} className={clsx("typography typography--h5", className)}>
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 {...rest} className={clsx("typography typography--h6", className)}>
          {children}
        </h6>
      );
    default:
      return (
        <p {...rest} className={clsx("typography typography--body", className)}>
          {children}
        </p>
      );
  }
}

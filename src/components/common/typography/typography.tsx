export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body";
}

export function Typography({
  children,
  variant = "body",
  ...props
}: TypographyProps) {
  switch (variant) {
    case "h1":
      return (
        <h1 {...props} className="typography typography--h1">
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 {...props} className="typography typography--h2">
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 {...props} className="typography typography--h3">
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 {...props} className="typography typography--h4">
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 {...props} className="typography typography--h5">
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 {...props} className="typography typography--h6">
          {children}
        </h6>
      );
    default:
      return (
        <p {...props} className="typography typography--body">
          {children}
        </p>
      );
  }
}

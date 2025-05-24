interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Box({ children, ...props }: BoxProps) {
  const { style, ...rest } = props;

  return (
    <div
      style={{
        backgroundColor: "#0E0E0E",
        padding: 8,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

interface RowProps {
  children: React.ReactNode;
  gap?: number;
  align?: "center" | "start" | "end";
  justify?: "center" | "start" | "end";
}

export function Row({ children, gap = 44, align = "center", justify = "center" }: Readonly<RowProps>) {
  return <div style={{ display: "flex", gap, alignItems: align, justifyContent: justify }}>{children}</div>;
}

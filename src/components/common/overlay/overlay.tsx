export interface OverlayProps {
  children: React.ReactNode;
}

export function Overlay({ children }: OverlayProps) {
  return <aside className="overlay">{children}</aside>;
}

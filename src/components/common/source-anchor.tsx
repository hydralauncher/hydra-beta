import { Typography } from "./typography";

export interface SourceAnchorProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick?: () => void;
}

export function SourceAnchor({
  title,
  onClick,
  ...props
}: Readonly<SourceAnchorProps>) {
  return (
    <button onClick={onClick} {...props}>
      <div className="source-anchor">
        <Typography variant="body" className="source-anchor__title">
          {title}
        </Typography>
      </div>
    </button>
  );
}

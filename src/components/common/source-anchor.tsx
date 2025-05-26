import { Typography } from "./typography";

export interface SourceAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  href: string;
}

export function SourceAnchor({
  title,
  href,
  ...props
}: Readonly<SourceAnchorProps>) {
  return (
    <a href={href} {...props}>
      <div className="source-anchor">
        <Typography variant="body" className="source-anchor__title">
          {title}
        </Typography>
      </div>
    </a>
  );
}

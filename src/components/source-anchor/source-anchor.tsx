import Link from "next/link";
import "./source-anchor.scss";
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
    <Link href={href} {...props}>
      <div className="source-anchor">
        <p className="source-anchor__title">{title}</p>
      </div>
    </Link>
  );
}

import Link from "next/link";

export interface SourceAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  href?: string;
}

export function SourceAnchor({
  title,
  href,
  ...props
}: Readonly<SourceAnchorProps>) {
  return (
    <>
      {href ? (
        <Link href={href} {...props}>
          <div className="source-anchor source-anchor--link">
            <p className="source-anchor__title">{title}</p>
          </div>
        </Link>
      ) : (
        <div className="source-anchor">
          <p className="source-anchor__title">{title}</p>
        </div>
      )}
    </>
  );
}
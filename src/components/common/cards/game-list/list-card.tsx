import { SourceAnchor } from "@/components/common";
import "./list-card.scss";

export interface ListCardProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  description: string;
  image: string;
  action?: React.ReactNode;
  sources?: string[];
  href: string;
}

export function ListCard({
  title,
  description,
  image,
  action,
  sources,
  href,
  ...props
}: Readonly<ListCardProps>) {
  return (
    <a href={href} {...props}>
      <div className="list-card">
        <div className="list-card__image">
          <img src={image} alt="Game List Card" width={200} height={100} />
        </div>
        <div className="list-card__content">
          <div className="list-card__content__info">
            <h3 className="list-card__content__info__title">{title}</h3>
            <p className="list-card__content__info__description">
              {description}
            </p>
            {sources && (
              <div className="list-card__content__info__sources">
                {sources.map((source) => (
                  <SourceAnchor title={source} href="/" key={source} />
                ))}
              </div>
            )}
          </div>
          <div className="list-card__content__action">{action}</div>
        </div>
      </div>
    </a>
  );
}

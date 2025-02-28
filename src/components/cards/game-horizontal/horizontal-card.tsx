import Image from "next/image";
import "./horizontal-card.scss";

interface HorizontalCardProps {
  image: string;
  title: string;
  description: string;
  action: React.ReactNode;
}

export function HorizontalCard({
  image,
  title,
  description,
  action,
}: Readonly<HorizontalCardProps>) {
  return (
    <div className="horizontal-card">
      <div className="horizontal-card__image">
        <Image src={image} width={268} height={136} alt={title} />
      </div>
      <div className="horizontal-card__content">
        <div className="horizontal-card__content__info">
          <h3 className="horizontal-card__content__info__title">{title}</h3>
          <p className="horizontal-card__content__info__description">{description}</p>
        </div>
        <div className="horizontal-card__content__action">{action}</div>
      </div>
    </div>
  );
}

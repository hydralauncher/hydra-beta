import { Backdrop } from "../backdrop/backdrop";

export interface ImageLightboxProps {
  src: string;
  alt: string;
}

export function ImageLightbox({ src, alt }: ImageLightboxProps) {
  return (
    <Backdrop>
      <img src={src} alt={alt} className="image-lightbox" />
    </Backdrop>
  );
}

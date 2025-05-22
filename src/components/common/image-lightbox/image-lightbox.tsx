import { Overlay } from "../overlay/overlay";

export interface ImageLightboxProps {
  src: string;
  alt: string;
}

export function ImageLightbox({ src, alt }: ImageLightboxProps) {
  return (
    <Overlay>
      <img src={src} alt={alt} alt={alt} className="image-lightbox" />
    </Overlay>
  );
}

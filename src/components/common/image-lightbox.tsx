import Image from "next/image";
import { Backdrop } from "./backdrop";

export interface ImageLightboxProps {
  src: string;
  alt: string;
}

export function ImageLightbox({ src, alt }: Readonly<ImageLightboxProps>) {
  return (
    <Backdrop>
      <Image src={src} alt={alt} className="image-lightbox" />
    </Backdrop>
  );
}

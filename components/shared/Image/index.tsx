import Image, { StaticImageData } from 'next/image';

type Props = {
  src: string | StaticImageData;
  alt?: string;
  className?: string;
  width?:number
};

const ImageComponent = ({ src, alt, className, width }: Props) => {
  return <Image className={className} src={src} alt={alt} width={width} />;
};

export default ImageComponent;

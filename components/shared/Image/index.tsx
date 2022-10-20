import Image from 'next/image';

type Props = {
  src: string,
  alt?: string,
  className?: string,
}

const ImageComponent = ({ src, alt, className }: Props) => {
  return (
    <Image className={className} src={src} alt={alt}/>
  );
};

export default ImageComponent;

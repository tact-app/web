type Props = {
  src: string,
  alt?: string,
  className?: string,
}

const ImageComponent = ({ src, alt, className }: Props) => {
  return (
    <img className={className} src={src} alt={alt}/>
  );
};

export default ImageComponent;
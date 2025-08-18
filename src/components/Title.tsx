type TitleProps = {
  title: string;
  subtitle: string;
};

export default function Title({ title, subtitle }: TitleProps) {
  return (
    <div className="text-center mb-12 px-2 md:px-0">
      <h2 className="font-sans font-bold text-2xl md:text-4xl  text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

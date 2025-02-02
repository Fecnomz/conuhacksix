import { Card, CardHeader, CardBody, Divider, Image } from "@heroui/react";

interface CardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  description: string;
  badgeColorClass?: string;
  onClick?: () => void;
}

export default function CardComponent({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  description,
  badgeColorClass = "bg-green-500",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className="w-full cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <Card className="max-w-[400px] relative shadow-md hover:shadow-lg">
        <CardHeader className="flex gap-3 relative">
          <div className="relative">
            <Image alt={imageAlt} height={40} radius="full" src={imageSrc} width={40} />
            <div
              className={`absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 z-10 w-3.5 h-3.5 rounded-full border-2 border-white ${badgeColorClass}`}
            ></div>
          </div>
          <div className="flex flex-col">
            <p className="text-md font-bold">{title}</p>
            <p className="text-small text-gray-500">{subtitle}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{description}</p>
        </CardBody>
      </Card>
    </div>
  );
}

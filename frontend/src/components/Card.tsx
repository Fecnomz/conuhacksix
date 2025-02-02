import { Card, CardHeader, CardBody, Divider, Image } from "@heroui/react";

interface CardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  description: string;
  badgeColorClass?: string;
}

export default function CardComponent({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  description,
  badgeColorClass = "bg-green-500",
}: CardProps) {
  return (
    <Card className="max-w-[400px] relative">
      <CardHeader className="flex gap-3 relative">
        <div className="relative">
          <Image alt={imageAlt} height={40} radius="full" src={imageSrc} width={40} />
          {/* Circular Badge */}
          <div
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${badgeColorClass}`}
          ></div>
        </div>

        {/* Title and Subtitle */}
        <div className="flex flex-col">
          <p className="text-md font-bold">{title}</p>
          <p className="text-small text-default-500">{subtitle}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>{description}</p>
      </CardBody>
    </Card>
  );
}

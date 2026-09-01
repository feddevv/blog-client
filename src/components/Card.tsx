import type { MouseEvent } from 'react';
import Like from './Like';

export interface CardProps {
  img: string;
  title: string;
  description: string;
  likes: number;
  isLiked: boolean;
  onLikeClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function Card({
  img,
  title,
  description,
  likes,
  isLiked,
  onLikeClick,
}: CardProps) {
  return (
    <article className="border border-border inline-flex flex-col bg-card cursor-pointer group/card hover:shadow hover:-translate-y-1 transition-all duration-250 w-full">
      <div className="overflow-hidden w-full">
        <img
          src={img}
          width={350}
          height={250}
          className="aspect-video w-full group-hover/card:scale-105 object-cover transition-transform duration-250"
          alt=""
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-card-foreground font-heading font-bold text-[18px] mb-2 group-hover/card:text-accent transition-colors duration-250 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {description}
        </p>

        <div className="h-px w-ull bg-muted my-4 self-stretch"></div>

        <Like
          isLiked={isLiked}
          likes={likes}
          onLikeClick={onLikeClick}
          className="ml-auto text-[18px]"
        />
      </div>
    </article>
  );
}

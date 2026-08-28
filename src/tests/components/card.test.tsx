import Card from '@/components/Card';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Card component', () => {
  const card = {
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    title: 'Clean Code Handbook',
    description:
      'Essential tips and best practices for writing clean, maintainable code.',
    likes: 142,
    isLiked: false,
  };

  it('should render basic card', () => {
    render(
      <Card
        img={card.img}
        title={card.title}
        description={card.description}
        likes={card.likes}
        isLiked={card.isLiked}
      />
    );

    expect(screen.getByRole('presentation', { name: '' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: card.title })
    ).toBeInTheDocument();
    expect(screen.getByText(card.description)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Like' })).toHaveTextContent(
      `${card.likes}`
    );
  });
});

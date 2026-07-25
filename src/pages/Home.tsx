import Input from '@/components/Input';
import { LabelWrapper } from '@/components/Label';
import { LuSearch } from 'react-icons/lu';
import Card, { type CardProps } from '@/components/Card';
import Button from '@/components/Button';

const mockCards: CardProps[] = [
  {
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    title: 'Clean Code Handbook',
    description:
      'Essential tips and best practices for writing clean, maintainable code.',
    likes: 142,
  },
  {
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    title: 'React & TypeScript Guide',
    description:
      'Comprehensive guide to typing components, hooks, and context in modern React apps.',
    likes: 89,
  },
  {
    img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    title: 'Tailwind CSS Secrets',
    description:
      'Build responsive interfaces rapidly without writing verbose custom CSS.',
    likes: 256,
  },
  {
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    title: 'Node.js REST API Architecture',
    description:
      'Building scalable backend services using Express, Zod, and Prisma ORM.',
    likes: 115,
  },
  {
    img: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    title: 'Git & GitHub Workflow',
    description:
      'Best practices for managing branches, commits, and resolving merge conflicts.',
    likes: 74,
  },
  {
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    title: 'Data Visualization with D3',
    description:
      'Creating interactive charts and visually appealing dashboards for analytics.',
    likes: 42,
  },
  {
    img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    title: 'UI/UX Design Essentials',
    description:
      'Fundamentals of grids, typography, contrast, and color schemes for developers.',
    likes: 310,
  },
  {
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    title: 'Testing React Applications',
    description:
      'Writing reliable unit and integration tests with Vitest and React Testing Library.',
    likes: 98,
  },
  {
    img: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
    title: 'Performance Optimization',
    description:
      'Optimizing bundle sizes, implementing lazy loading, and preventing re-renders.',
    likes: 183,
  },
  {
    img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
    title: 'Modern JavaScript Mechanics',
    description:
      'Deep dive into async execution, event loop, promises, closures, and prototypes.',
    likes: 220,
  },
];

export default function Home() {
  return (
    <>
      <section className="py-16 px-4 border-b border-border">
        <p className="text-accent text-[clamp(12px,2vw,14px)] font-paragraph mb-4">
          INDEPENDENT · THOUGHTFUL · TECHNICAL
        </p>
        <h2 className="font-heading font-bold text-[clamp(32px,5vw,46px)] text-foreground mb-3">
          Writing worth your attention.
        </h2>
        <p className="text-muted-foreground max-w-150 text-[clamp(15px,2vw,18px)]">
          Deep-dive articles on engineering, design, and the intersection of
          technology and life — written by practitioners.
        </p>

        <LabelWrapper className="bg-input-background p-2 border border-border mt-4">
          <LuSearch className="text-base text-muted-foreground" />
          <Input
            intent={'unstyled'}
            type="search"
            placeholder="Search 5000+ posts..."
            className="font-3xl"
          />
        </LabelWrapper>
      </section>

      <section className="px-4 py-10 flex flex-col items-center gap-10">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockCards.map((card) => (
            <Card
              img={card.img}
              title={card.title}
              description={card.description}
              likes={card.likes}
            />
          ))}
        </div>

        <Button intent={'secondary'} size={'md'}>
          Load more posts
        </Button>
      </section>
    </>
  );
}

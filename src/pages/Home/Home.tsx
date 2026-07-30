import Input from '@/components/Input';
import { LabelWrapper } from '@/components/Label';
import { LuSearch } from 'react-icons/lu';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Footer from '@/pages/Home/Footer';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/services/posts';
import Spinner from '@/components/Spinner';
import NoPosts from './NoPosts';
import { useState } from 'react';
import useDebounce from '@/hooks/useDebounce';

export default function Home() {
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 1000);

  const { data, isPending } = useQuery({
    queryKey: ['posts', { search: debouncedSearch }],
    queryFn: () => getPosts(debouncedSearch),
  });

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

        <form onSubmit={(e) => e.preventDefault()} role="search">
          <LabelWrapper className="bg-input-background p-2 border border-border mt-4">
            <LuSearch className="text-base text-muted-foreground" />
            <Input
              intent={'unstyled'}
              type="search"
              name="search"
              placeholder="Search 5000+ posts..."
              className="font-3xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </LabelWrapper>
        </form>
      </section>

      <section className="px-4 py-10 flex flex-col items-center gap-10 min-h-100">
        {isPending ? (
          <Spinner className="m-auto" />
        ) : data && data.length ? (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.map((card) => (
                <Card
                  img={'https://placehold.co/400x300'}
                  title={card.title}
                  description={card.description ?? 'No description'}
                  likes={100}
                />
              ))}
            </div>

            <Button intent={'secondary'} size={'md'}>
              Load more posts
            </Button>
          </>
        ) : (
          <NoPosts />
        )}
      </section>

      <Footer />
    </>
  );
}

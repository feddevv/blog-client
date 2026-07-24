import Input from '@/components/Input';
import { LabelWrapper } from '@/components/Label';
import { LuSearch } from 'react-icons/lu';

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

        <LabelWrapper className="bg-white p-2 border border-border mt-4">
          <LuSearch className="text-base text-muted-foreground" />
          <Input
            intent={'unstyled'}
            type="search"
            placeholder="Search 5000+ posts..."
          />
        </LabelWrapper>
      </section>
    </>
  );
}

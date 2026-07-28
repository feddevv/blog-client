import Button from '@/components/Button';
import Input from '@/components/Input';
import { FiRss } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border px-4 py-12">
      <FiRss className="text-accent text-2xl mb-4" />
      <h2 className="text-primary font-heading font-bold text-[clamp(20px,2vw,24px)] mb-1">
        Get the best articles in your inbox.
      </h2>
      <p className="text-muted-foreground text-[clamp(14px,1.5vw,16px)] mb-4">
        Weekly digest. No noise. Unsubscribe anytime.
      </p>

      <div className="max-w-130 flex items-center gap-2">
        <Input type="email" placeholder="you@example.com" intent={'primary'} />
        <Button intent={'primary'} size={'sm'}>
          Subscribe
        </Button>
      </div>
    </footer>
  );
}

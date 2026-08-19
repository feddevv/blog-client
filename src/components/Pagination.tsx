import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import Button from './Button';
import { usePagination } from '@/hooks/usePagination';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  handleChangePage: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  handleChangePage,
}: PaginationProps) {
  const paginationRange = usePagination({ totalPages, currentPage });

  return (
    <div className="flex items-center gap-1.5">
      <Button
        intent={'secondary'}
        className="rounded-full p-1"
        onClick={() => handleChangePage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <LuChevronLeft className="text-2xl" />
      </Button>

      {paginationRange.map((item, index) =>
        typeof item === 'string' ? (
          <p className="text-xl text-primary">{item}</p>
        ) : (
          <Button
            key={index}
            intent={item == currentPage ? 'primary' : 'secondary'}
            className="p-1 w-8 h-8 rounded-full"
            onClick={() => handleChangePage(item)}
          >
            {item}
          </Button>
        )
      )}

      <Button
        intent={'secondary'}
        className="rounded-full p-1"
        onClick={() => handleChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <LuChevronRight className="text-2xl" />
      </Button>
    </div>
  );
}

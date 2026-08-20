import { range } from '@/utils/utils';

interface UsePaginationParams {
  totalPages: number;
  currentPage: number;
  siblingsCount?: number;
}

export const usePagination = ({
  totalPages,
  currentPage,
  siblingsCount = 1,
}: UsePaginationParams) => {
  const totalPagesNumber = 2 * siblingsCount + 5;

  if (totalPagesNumber >= totalPages) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingsCount, 1);
  const rightSibling = Math.min(currentPage + siblingsCount, totalPages);

  const shouldShowLeftDots = leftSibling > 2;
  const shouldShowRightDots = rightSibling < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingsCount;
    const leftRange = range(1, leftItemCount);
    return [...leftRange, '...', totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingsCount;
    const rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [1, '...', ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = range(leftSibling, rightSibling);
    return [1, '...', ...middleRange, '...', totalPages];
  }

  return [];
};

import { NavLink } from 'react-router';
import Input from '@/components/Input';
import { LabelWrapper } from '@/components/Label';
import { LuPlus, LuSearch, LuFilter } from 'react-icons/lu';
import type { StatusFilter } from './types';

interface AdminToolbarProps {
  onCreatePost?: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  selectedFilter?: StatusFilter;
  onFilterChange?: (filter: StatusFilter) => void;
}

export default function AdminToolbar({
  onCreatePost,
  searchTerm = '',
  onSearchChange,
  selectedFilter = 'ALL',
  onFilterChange,
}: AdminToolbarProps) {
  const filterOptions: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Hidden', value: 'HIDDEN' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="max-w-md w-full">
          <LabelWrapper className="bg-card px-3 py-2 border border-border">
            <LuSearch className="text-base text-muted-foreground shrink-0" />
            <Input
              intent="unstyled"
              type="search"
              placeholder="Search posts by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="placeholder:text-sm"
              aria-label="Search posts"
            />
          </LabelWrapper>
        </div>

        <div
          className="flex items-center bg-secondary/60 p-1 border border-border rounded-xs overflow-x-auto"
          role="group"
          aria-label="Filter posts by status"
        >
          <div className="hidden sm:flex items-center px-2 text-muted-foreground text-xs font-paragraph">
            <LuFilter className="mr-1 text-xs" />
            Filter:
          </div>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onFilterChange?.(option.value)}
              className={`px-3 py-1 text-xs font-paragraph font-medium transition-all duration-150 cursor-pointer rounded-xs whitespace-nowrap ${
                selectedFilter === option.value
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <NavLink
          to={'/posts/create'}
          onClick={onCreatePost}
          className="flex items-center gap-2 font-medium shadow-xs w-full sm:w-auto bg-primary text-primary-foreground py-1 px-4 hover:bg-button-hover active:scale-98 transition-all duration-200"
        >
          <LuPlus className="text-base" />
          <span>Create post</span>
        </NavLink>
      </div>
    </div>
  );
}

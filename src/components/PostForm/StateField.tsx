import Label from '@/components/Label';
import Select from '@/components/Select';
import { LuGlobe, LuEyeOff, LuChevronDown } from 'react-icons/lu';
import type { FieldProps } from './types';
import { useState } from 'react';

interface StateFieldProps extends FieldProps {
  initialValue?: 'PUBLISHED' | 'HIDDEN';
}

export default function StateField({
  register,
  initialValue,
}: StateFieldProps) {
  const [state, setState] = useState<'PUBLISHED' | 'HIDDEN'>(
    initialValue || 'PUBLISHED'
  );
  return (
    <div
      className={`bg-card border border-border p-5 rounded-xs flex flex-col gap-4`}
    >
      <div className="flex items-center justify-between">
        <Label
          htmlFor="post-state"
          intent="primary"
          size="sm"
          className="uppercase tracking-wider font-semibold text-xs flex items-center gap-1.5"
        >
          <LuGlobe className="text-accent text-sm" />
          State <span className="text-accent">*</span>
        </Label>
        <span className="text-xs font-paragraph text-muted-foreground">
          Visibility
        </span>
      </div>

      <div className="relative">
        <Select
          id="post-state"
          defaultValue={initialValue}
          className="bg-secondary/60 font-paragraph pr-10 appearance-none rounded-xs"
          {...register('state')}
          onChange={(e) => setState(e.target.value as 'PUBLISHED' | 'HIDDEN')}
        >
          <option value="PUBLISHED">Published</option>
          <option value="HIDDEN">Hidden</option>
        </Select>
        <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-sm" />
      </div>

      <div className="grid grid-cols-1 gap-2 pt-1">
        <div
          className={`flex items-start gap-2.5 p-2.5 rounded-xs border ${state === 'PUBLISHED' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border bg-secondary/30'} text-xs`}
        >
          {state === 'PUBLISHED' ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse" />
          ) : (
            <LuEyeOff className="text-muted-foreground text-xs mt-1 shrink-0" />
          )}
          <div>
            <span className="font-medium text-foreground">Published</span>
            <p className="text-muted-foreground text-[11px] mt-0.5 leading-normal">
              Immediately live and visible to all readers on the home feed and
              search.
            </p>
          </div>
        </div>

        <div
          className={`flex items-start gap-2.5 p-2.5 rounded-xs border ${state === 'HIDDEN' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border bg-secondary/30'} text-xs`}
        >
          {state === 'HIDDEN' ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-pulse" />
          ) : (
            <LuEyeOff className="text-muted-foreground text-xs mt-1 shrink-0" />
          )}
          <div>
            <span className="font-medium text-foreground">Hidden</span>
            <p className="text-muted-foreground text-[11px] mt-0.5 leading-normal">
              Unlisted from the public feed. Accessible only through direct link
              or admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

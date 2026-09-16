import Label from '@/components/Label';
import Textarea from '@/components/Textarea';
import {
  LuFileText,
  LuBold,
  LuItalic,
  LuHeading,
  LuQuote,
  LuCode,
  LuList,
  LuListOrdered,
  LuLink,
  LuImage,
  LuSparkles,
  LuEye,
  LuFilePenLine,
} from 'react-icons/lu';
import type { FieldProps } from './types';
import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  calculateReadingTime,
  linesAmountFor,
  wordsAmountFor,
} from '@/utils/utils';

interface ContentEditorFieldProps extends FieldProps {
  initialValue?: string;
}

export default function ContentEditorField({
  register,
  initialValue,
}: ContentEditorFieldProps) {
  const toolbarButtons = [
    { icon: LuBold, label: 'Bold', shortcut: '**text**' },
    { icon: LuItalic, label: 'Italic', shortcut: '*text*' },
    { icon: LuHeading, label: 'Heading', shortcut: '# Heading' },
    { icon: LuQuote, label: 'Quote', shortcut: '> Quote' },
    { icon: LuCode, label: 'Code', shortcut: '`code`' },
    { icon: LuList, label: 'Bullet List', shortcut: '- Item' },
    { icon: LuListOrdered, label: 'Numbered List', shortcut: '1. Item' },
    { icon: LuLink, label: 'Link', shortcut: '[title](url)' },
    { icon: LuImage, label: 'Image', shortcut: '![alt](url)' },
  ];
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [content, setContent] = useState(initialValue || '');

  return (
    <div
      className={`bg-card border border-border rounded-xs overflow-hidden flex flex-col`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="post-content"
            intent="primary"
            size="sm"
            className="uppercase tracking-wider font-semibold text-xs flex items-center gap-1.5"
          >
            <LuFileText className="text-accent text-sm" />
            Article Content <span className="text-accent">*</span>
          </Label>
        </div>

        <div
          className="flex items-center bg-secondary p-1 border border-border rounded-xs"
          role="tablist"
          aria-label="Editor view modes"
        >
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-paragraph font-medium ${tab === 'write' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground rounded-xs'} rounded-xs cursor-pointer`}
            role="tab"
            aria-selected={tab === 'write'}
            onClick={() => setTab('write')}
          >
            <LuFilePenLine
              className={`text-xs ${tab === 'write' ? 'text-accent' : ''}`}
            />
            <span>Write</span>
          </button>
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-paragraph font-medium ${tab === 'preview' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground rounded-xs'} rounded-xs cursor-pointer`}
            role="tab"
            aria-selected={tab === 'preview'}
            onClick={() => setTab('preview')}
          >
            <LuEye
              className={`text-xs ${tab === 'preview' ? 'text-accent' : ''}`}
            />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div
        className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-card"
        role="toolbar"
        aria-label="Markdown formatting toolbar"
      >
        {toolbarButtons.map((btn, index) => {
          const Icon = btn.icon;
          return (
            <button
              key={index}
              type="button"
              title={`${btn.label} (${btn.shortcut})`}
              aria-label={btn.label}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xs transition-colors cursor-pointer text-sm"
            >
              <Icon />
            </button>
          );
        })}
      </div>

      {/* Content Textarea */}
      <div className="relative">
        {tab === 'write' ? (
          <Textarea
            id="post-content"
            rows={18}
            placeholder={`# Introduction\n\nStart writing your article here with rich Markdown formatting...\n\n## Key Takeaways\n\n- Highlight insightful takeaways\n- Use **bold** emphasis and *italic* nuance\n- Add code blocks and tables easily\n\n\`\`\`typescript\nfunction publishArticle(post: Post) {\n  console.log("Publishing:", post.title);\n}\n\`\`\`\n\n> "Clear writing begins with clear thinking."`}
            className="bg-card border-0 rounded-none font-paragraph sm:text-base leading-relaxed p-4 focus-visible:ring-0 focus-visible:border-0 resize-y"
            {...register('content')}
            defaultValue={initialValue}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <div className="bg-card font-paragraph sm:text-base p-4 prose max-h-96 max-w-full w-full overflow-y-auto">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-secondary/30 border-t border-border text-xs font-paragraph text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <LuSparkles className="text-accent text-xs" />
          <span>Markdown & GitHub Flavored Markdown (GFM) supported</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{wordsAmountFor(content)} words</span>
          <span>·</span>
          <span>{linesAmountFor(content)} lines</span>
          <span>·</span>
          <span>~{calculateReadingTime(wordsAmountFor(content))} min read</span>
        </div>
      </div>
    </div>
  );
}

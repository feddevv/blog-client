import 'react';

type Command =
  | 'show-modal'
  | 'close'
  | 'request-close'
  | 'show-popover'
  | 'hide-popover'
  | 'toggle-popover';

declare module 'react' {
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    command?: Command;
    commandfor?: string;
  }
}

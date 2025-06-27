declare module 'quote-unquote' {
  export function unquote(str: string): string;
  export function quote(str: string): string;
  export function single(str: string): string;
  export function double(str: string): string;
}

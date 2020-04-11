export interface CodeSnippet {
  html?: {
    code: string;
    language?: 'html';
    async?: boolean;
    callback?: (element: Element) => void | undefined;
    hooks?: object;
    interpolation?: object | undefined;
  };
  ts?: {
    code: string;
    language?: 'typescript';
    async?: boolean;
    callback?: (element: Element) => void | undefined;
    hooks?: object;
    interpolation?: object | undefined;
  };
  scss?: {
    code: string;
    language?: 'css';
    async?: boolean;
    callback?: (element: Element) => void | undefined;
    hooks?: object;
    interpolation?: object | undefined;
  };
}

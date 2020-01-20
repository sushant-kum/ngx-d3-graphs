export interface GridOptionsModel {
  x?: {
    show?: boolean;
    lines?: {
      value: number | string | Date;
      text?: string;
      position?: 'start' | 'middle' | 'end';
      class?: string;
    }[];
  };
  y?: {
    show?: boolean;
    lines?: {
      value: number | string | Date;
      text?: string;
      position?: 'start' | 'middle' | 'end';
      class?: string;
    }[];
  };
}

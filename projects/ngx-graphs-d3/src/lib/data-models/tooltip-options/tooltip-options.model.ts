export interface TooltipOptionsModel {
  show?: boolean;
  grouped?: boolean;
  format?: {
    title?: (x: number | string | Date) => string;
    key?: (key: string, ratio?: number | undefined) => string;
    value?: (value: number | Date, ratio?: number | undefined) => string;
  };
  position?: {
    top?: number;
    left?: number;
  };
}

export interface LegendOptionsModel {
  show?: boolean;
  hide?: string[];
  position?: 'inset';
  inset?: {
    anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    x?: number;
    y?: number;
    // step?: number;
  };
  title?: {
    text: string;
    width?: number;
  };
  onclick?: (id: any) => any;
  onmouseover?: (id: any) => any;
  onmouseout?: (id: any) => any;
}

export interface LegendOptionsModel {
  show?: boolean;
  hide?: string[];
  position?: 'bottom' | 'inset';
  bottom?: {
    align?: 'left' | 'center' | 'right';
  };
  inset?: {
    anchor?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    x?: number;
    y?: number;
    // step?: number;
  };
  onclick?: (id: any) => any;
  onmouseover?: (id: any) => any;
  onmouseout?: (id: any) => any;
}

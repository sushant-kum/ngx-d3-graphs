export interface StackedAreaDataModel {
  color_hex?: string;
  key: string;
  plot: {
    x: number | string | Date;
    y: number | Date;
  };
}

export interface StackedAreaOptionsModel {
  area?: {
    stroke?: {
      color_hex?: string;
      width?: number;
    };
    opacity?: {
      unhovered?: number;
      hovered?: number;
    };
  };
}

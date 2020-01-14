export interface StackedAreaDataModel {
  color_hex?: string;
  key: string;
  plot: {
    x: number | string | Date;
    y: number;
  };
}

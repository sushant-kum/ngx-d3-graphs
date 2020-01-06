export interface GraphOptionsModel {
  no_data_text?: string;
  size?: {
    width?: number | 'responsive';
    height?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  color?: {
    pattern?: string[];
  };
  interaction?: {
    enabled?: boolean;
  };
  transition?: {
    duration?: number;
  };
}

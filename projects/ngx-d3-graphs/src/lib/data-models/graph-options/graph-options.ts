export interface GraphOptionsModel {
  size?: {
    width?: number;
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

export interface AxisOptionsModel {
  rotated?: boolean;
  x?: {
    show?: boolean;
    type?: 'timeseries' | 'category' | 'indexed';
    localtime?: boolean;
    categories?: string[];
    tick?: {
      centered?: boolean;
      format?: (x) => string;
      culling?:
        | boolean
        | {
            max: number;
          };
      count?: number;
      fit?: boolean;
      values?: (number | string | Date)[];
      rotate?: number;
      outer?: boolean;
      multiline?: boolean;
      multilineMax?: number;
    };
    min?: number | Date;
    max?: number | Date;
    extent?: (number | Date)[];
    label?: {
      text?: string;
      position?:
        | 'inner-right'
        | 'inner-center'
        | 'inner-left'
        | 'outer-right'
        | 'outer-center'
        | 'outer-left'
        | 'inner-top'
        | 'inner-middle'
        | 'inner-bottom'
        | 'outer-top'
        | 'outer-middle'
        | 'outer-bottom';
    };
  };
  y?: {
    show?: boolean;
    inner?: boolean;
    type?: 'linear' | 'timeseries';
    min?: number | Date;
    max?: number | Date;
    inverted?: boolean;
    center?: number | Date;
    label?: {
      text?: string;
      position?:
        | 'inner-right'
        | 'inner-center'
        | 'inner-left'
        | 'outer-right'
        | 'outer-center'
        | 'outer-left'
        | 'inner-top'
        | 'inner-middle'
        | 'inner-bottom'
        | 'outer-top'
        | 'outer-middle'
        | 'outer-bottom';
    };
    tick?: {
      format?: (x) => string;
      count?: number;
      values?: (number | Date)[];
      outer?: boolean;
    };
    default?: (number | Date)[];
  };
  y2?: {
    show?: boolean;
    inner?: boolean;
    type?: 'linear' | 'timeseries';
    min?: number | Date;
    max?: number | Date;
    inverted?: boolean;
    center?: number | Date;
    label?: {
      text?: string;
      position?:
        | 'inner-right'
        | 'inner-center'
        | 'inner-left'
        | 'outer-right'
        | 'outer-center'
        | 'outer-left'
        | 'inner-top'
        | 'inner-middle'
        | 'inner-bottom'
        | 'outer-top'
        | 'outer-middle'
        | 'outer-bottom';
    };
    tick?: {
      format?: (x) => string;
      count?: number;
      values?: (number | Date)[];
      outer?: boolean;
    };
    default?: (number | Date)[];
  };
}

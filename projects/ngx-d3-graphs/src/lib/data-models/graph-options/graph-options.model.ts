import { AxisOptionsModel } from '../axis-options/axis-options.model';
import { GridOptionsModel } from '../grid-options/grid-options.model';
import { RegionOptionsModel } from '../region-options/region-options.model';
import { LegendOptionsModel } from '../legend-options/legend-options.model';
import { PointOptionsModel } from '../point-options/point-options-model';
import { PointerLineOptionsModel } from '../pointer-line-options/pointer-line-options.model';
import { TooltipOptionsModel } from '../tooltip-options/tooltip-options.model';

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
  axis?: AxisOptionsModel;
  grid?: GridOptionsModel;
  regions?: RegionOptionsModel[];
  legend?: LegendOptionsModel;
  point?: PointOptionsModel;
  pointer_line?: PointerLineOptionsModel;
  tooltip?: TooltipOptionsModel;
}

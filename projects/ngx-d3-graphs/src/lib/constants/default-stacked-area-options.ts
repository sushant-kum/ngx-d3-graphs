import { StackedAreaOptionsModel } from '../data-models/stacked-area/stacked-area.model';

export const DEFAULT_STACKED_AREA_OPTIONS: StackedAreaOptionsModel = {
  area: {
    stroke: {
      color_hex: undefined,
      width: 1
    },
    opacity: {
      unhovered: 0.2,
      hovered: 1
    }
  }
};

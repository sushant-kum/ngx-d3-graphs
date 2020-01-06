import * as uniqueColors from 'unique-colors';

import { GraphOptionsModel } from '../data-models/graph-options/graph-options.model';

export const DEFAULT_GRAPH_OPTIONS: GraphOptionsModel = {
  no_data_text: 'No depictable data',
  size: {
    width: 'responsive',
    height: 300
  },
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  color: {
    pattern: uniqueColors.unique_colors(20)
  },
  interaction: {
    enabled: true
  },
  transition: {
    duration: 350
  }
};

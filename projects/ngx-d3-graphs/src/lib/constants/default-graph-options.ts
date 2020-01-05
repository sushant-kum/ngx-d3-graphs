import * as distinctColors from 'distinct-colors';

import { GraphOptionsModel } from '../data-models/graph-options/graph-options';

export const DEFAULT_GRAPH_OPTIONS: GraphOptionsModel = {
  size: {
    width: undefined,
    height: undefined
  },
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  color: {
    pattern: distinctColors({ count: 20 })
  }
};

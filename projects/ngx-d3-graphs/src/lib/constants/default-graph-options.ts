import palette from 'google-palette';

import { GraphOptionsModel } from '../data-models/graph-options/graph-options.model';

export const DEFAULT_GRAPH_OPTIONS: GraphOptionsModel = {
  no_data_text: 'No plottable data',
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
    pattern: palette('mpn65', 20).map((color: string) => `#${color}`)
  },
  interaction: {
    enabled: true
  },
  transition: {
    duration: 350
  },
  axis: {
    rotated: false,
    x: {
      show: true,
      type: 'indexed',
      localtime: true,
      categories: [],
      tick: {
        format: undefined,
        culling: true,
        count: undefined,
        fit: true,
        values: null,
        rotate: 0,
        outer: true,
        multiline: true,
        multilineMax: 0
      },
      min: undefined,
      max: undefined,
      extent: undefined,
      label: {
        text: 'X Axis',
        position: 'inner-right'
      }
    },
    y: {
      show: true,
      inner: false,
      type: 'linear',
      min: undefined,
      max: undefined,
      inverted: false,
      center: undefined,
      label: {
        text: 'Y Axis',
        position: 'inner-top'
      },
      tick: {
        format: undefined,
        outer: true,
        values: null,
        count: undefined
      },
      default: undefined
    }
    // y2: {
    //   show: false,
    //   inner: false,
    //   type: 'linear',
    //   min: undefined,
    //   max: undefined,
    //   inverted: false,
    //   center: undefined,
    //   label: {
    //     text: 'Y2 Axis',
    //     position: 'inner-top'
    //   },
    //   tick: {
    //     format: undefined,
    //     outer: true,
    //     values: null,
    //     count: undefined
    //   },
    //   default: undefined
    // }
  },
  grid: {
    x: {
      show: false,
      lines: []
    },
    y: {
      show: false,
      lines: []
    }
  },
  regions: [],
  legend: {
    show: true,
    hide: [],
    position: 'bottom',
    bottom: {
      align: 'center'
    },
    inset: {
      anchor: 'top-right',
      x: 0,
      y: 0
      // step: undefined
    },
    onclick: undefined,
    onmouseover: undefined,
    onmouseout: undefined
  },
  point: {
    show: true,
    r: 2.5,
    focus: {
      expand: {
        enabled: true,
        r: 4.38
      }
    }
  },
  pointer_line: {
    show: true,
    step: {
      type: 'step'
    }
  },
  tooltip: {
    show: true,
    grouped: true,
    format: {
      title: undefined,
      key: undefined,
      value: undefined
    },
    position: {
      top: 0,
      left: 10
    }
  }
};

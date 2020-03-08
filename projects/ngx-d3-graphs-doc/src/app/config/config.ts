import { environment as env } from '@doc/src/environments/environment';
import { Page } from '@doc/src/app/data-models/page/page';

export const CONFIG = env.production
  ? {
      app_title: 'NGX D3 Graphs',
      lib_version: '0.0.0',
      doc_version: '0.0.0'
    }
  : {
      app_title: 'NGX D3 Graphs (Dev)',
      lib_version: '0.0.0',
      doc_version: '0.0.0.dev'
    };

export const GRAPH_PAGES: Page[] = [
  {
    id: 'distribution',
    name: 'Distribution',
    disabled: true,

    items: [
      {
        id: 'violin',
        name: 'Violin',
        disabled: true,
        icon_path: '/assets/images/icon-distribution_violin.png'
      },
      {
        id: 'density',
        name: 'Density',
        disabled: true,
        icon_path: '/assets/images/icon-distribution_density.png'
      },
      {
        id: 'histogram',
        name: 'Histogram',
        disabled: true,
        icon_path: '/assets/images/icon-distribution_histogram.png'
      },
      {
        id: 'boxplot',
        name: 'Boxplot',
        disabled: true,
        icon_path: '/assets/images/icon-distribution_boxplot.png'
      },
      {
        id: 'ridgeline',
        name: 'Ridgeline',
        disabled: true,
        icon_path: '/assets/images/icon-distribution_ridgeline.png'
      }
    ]
  },
  {
    id: 'correlation',
    name: 'Correlation',
    disabled: true,
    items: [
      {
        id: 'scatter',
        name: 'Scatter',
        disabled: true,
        icon_path: '/assets/images/icon-correlation_scatter.png'
      },
      {
        id: 'heatmap',
        name: 'Heatmap',
        disabled: true,
        icon_path: '/assets/images/icon-correlation_heatmap.png'
      },
      {
        id: 'correlogram',
        name: 'Correlogram',
        disabled: true,
        icon_path: '/assets/images/icon-correlation_correlogram.png'
      },
      {
        id: 'bubble',
        name: 'Bubble',
        disabled: true,
        icon_path: '/assets/images/icon-correlation_bubble.png'
      },
      {
        id: 'connected-scatter',
        name: 'Connected scatter',
        disabled: true,
        icon_path: '/assets/images/icon-correlation_connected-scatter.png'
      },
      {
        id: 'density-2d',
        name: 'Density 2D',
        disabled: true,
        icon_path: '/assets/images/icon-correlation_density-2d.png'
      }
    ]
  },
  {
    id: 'ranking',
    name: 'Ranking',
    disabled: true,
    items: [
      {
        id: 'barplot',
        name: 'Barplot',
        disabled: true,
        icon_path: '/assets/images/icon-ranking_barplot.png'
      },
      {
        id: 'radar',
        name: 'Spider / Radar',
        disabled: true,
        icon_path: '/assets/images/icon-ranking_radar.png'
      },
      {
        id: 'wordcloud',
        name: 'Wordcloud',
        disabled: true,
        icon_path: '/assets/images/icon-ranking_wordcloud.png'
      },
      {
        id: 'parallel',
        name: 'Parallel',
        disabled: true,
        icon_path: '/assets/images/icon-ranking_parallel.png'
      },
      {
        id: 'lollipop',
        name: 'Lollipop',
        disabled: true,
        icon_path: '/assets/images/icon-ranking_lollipop.png'
      },
      {
        id: 'circular-barplot',
        name: 'Circular barplot',
        disabled: true,
        icon_path: '/assets/images/icon-ranking_circular-barplot.png'
      }
    ]
  },
  {
    id: 'part-of-a-whole',
    name: 'Part of a whole',
    disabled: true,
    items: [
      {
        id: 'treemap',
        name: 'Treemap',
        disabled: true,
        icon_path: '/assets/images/icon-part-of-a-whole_treemap.png'
      },
      {
        id: 'doughnut',
        name: 'Doughnut',
        disabled: true,
        icon_path: '/assets/images/icon-part-of-a-whole_doughnut.png'
      },
      {
        id: 'pie-chart',
        name: 'Pie chart',
        disabled: true,
        icon_path: '/assets/images/icon-part-of-a-whole_pie-chart.png'
      },
      {
        id: 'dendrogram',
        name: 'Dendrogram',
        disabled: true,
        icon_path: '/assets/images/icon-part-of-a-whole_dendrogram.png'
      },
      {
        id: 'circular-packing',
        name: 'Circular packing',
        disabled: true,
        icon_path: '/assets/images/icon-part-of-a-whole_circular-packing.png'
      }
    ]
  },
  {
    id: 'evolution',
    name: 'Evolution',
    router_link: ['/', 'graphs', 'evolution'],
    items: [
      {
        id: 'line-plot',
        name: 'Line plot',
        disabled: true,
        icon_path: '/assets/images/icon-evolution_line-plot.png'
      },
      {
        id: 'area',
        name: 'Area',
        disabled: true,
        icon_path: '/assets/images/icon-evolution_area.png'
      },
      {
        id: 'stacked-area',
        name: 'Stacked area',
        icon_path: '/assets/images/icon-evolution_stacked-area.png',
        router_link: ['/', 'graphs', 'evolution', 'stacked-area']
      },
      {
        id: 'streamchart',
        name: 'Streamchart',
        disabled: true,
        icon_path: '/assets/images/icon-evolution_streamchart.png'
      }
    ]
  },
  {
    id: 'map',
    name: 'Map',
    disabled: true,
    items: [
      {
        id: 'map',
        name: 'Map',
        disabled: true,
        icon_path: '/assets/images/icon-map_map.png'
      },
      {
        id: 'choropleth',
        name: 'Choropleth',
        disabled: true,
        icon_path: '/assets/images/icon-map_choropleth.png'
      },
      {
        id: 'hexbin-map',
        name: 'Hexbin map',
        disabled: true,
        icon_path: '/assets/images/icon-map_hexbin-map.png'
      },
      {
        id: 'cartogram',
        name: 'Cartogram',
        disabled: true,
        icon_path: '/assets/images/icon-map_cartogram.png'
      },
      {
        id: 'connection',
        name: 'Connection',
        disabled: true,
        icon_path: '/assets/images/icon-map_connection.png'
      },
      {
        id: 'bubble-map',
        name: 'Bubble map',
        disabled: true,
        icon_path: '/assets/images/icon-map_bubble-map.png'
      }
    ]
  },
  {
    id: 'flow',
    name: 'Flow',
    disabled: true,
    items: [
      {
        id: 'chord-diagram',
        name: 'Chord diagram',
        disabled: true,
        icon_path: '/assets/images/icon-flow_chord-diagram.png'
      },
      {
        id: 'network',
        name: 'Network',
        disabled: true,
        icon_path: '/assets/images/icon-flow_network.png'
      },
      {
        id: 'sankey',
        name: 'Sankey',
        disabled: true,
        icon_path: '/assets/images/icon-flow_sankey.png'
      },
      {
        id: 'arc-diagram',
        name: 'Arc diagram',
        disabled: true,
        icon_path: '/assets/images/icon-flow_arc-diagram.png'
      },
      {
        id: 'edge-bundling',
        name: 'Edge bundling',
        disabled: true,
        icon_path: '/assets/images/icon-flow_edge-bundling.png'
      }
    ]
  }
];

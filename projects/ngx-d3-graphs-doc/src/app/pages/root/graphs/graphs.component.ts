import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatButton } from '@angular/material/button';

import { HelperService } from '@doc/src/app/serices/helper/helper.service';

interface MenuItem {
  id: string;
  name?: string;
  disabled?: boolean;
  router_link?: string[];
  absolute_link?: string;
  icon_path?: string;
}

interface MenuGroup extends MenuItem {
  items?: MenuItem[];
}

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {
  @ViewChild('graphs_left_menu_small_toggle') graphs_left_menu_small_toggle: MatButton;
  @ViewChild('graphs_left_menu_small') graphs_left_menu_small: ElementRef;

  readonly menu_groups: MenuGroup[] = [
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
          icon_path: '/assets/images/icon-evolution_stacked-area.png'
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

  active_menu: {
    group: string;
    item: string;
  };

  constructor(private _router: Router, public helper: HelperService) {}

  ngOnInit(): void {
    // Set router_link of menu items
    this._setMenuRouterLinks();

    // Set active_menu on navigation
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._hideGraphLeftMenuSmall();
        this._setActiveMenu();
      }
    });

    // Set active_menu
    this._setActiveMenu();
  }

  /**
   * Set active_menu
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @private
   * @memberof GraphsComponent
   */
  private _setActiveMenu(): void {
    const group = this._router.url.includes('/graphs/')
      ? this._router.url.split('/graphs/')[1].split('/')[0]
      : undefined;
    const item = group !== undefined ? this._router.url.split('/graphs/')[1].split('/')[1] : undefined;
    console.log(this._router.url, group, item);

    this.active_menu = {
      group: group === undefined ? null : group,
      item: item === undefined ? null : item
    };
  }
  /**
   * Set router_link of menu items
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @private
   * @memberof GraphsComponent
   */
  private _setMenuRouterLinks(): void {
    for (const menu_group of this.menu_groups) {
      if (menu_group.items && menu_group.items.length > 0) {
        for (const menu_item of menu_group.items) {
          if (menu_item.absolute_link === undefined && menu_item.router_link === undefined) {
            menu_item.router_link = ['/', 'graphs', menu_group.id, menu_item.id];
          }
        }
      } else {
        if (menu_group.absolute_link === undefined && menu_group.router_link === undefined) {
          menu_group.router_link = ['/', 'graphs', menu_group.id];
        }
      }
    }
  }

  /**
   * Toggle visibility of left menu on small screens
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @memberof GraphsComponent
   */
  toggleGraphLeftMenuSmallVisibility(): void {
    if (this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.contains('is-active')) {
      this._hideGraphLeftMenuSmall();
    } else {
      this._showGraphLeftMenuSmall();
    }
  }

  /**
   * Hide left menu on small screens
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @private
   * @memberof GraphsComponent
   */
  private _hideGraphLeftMenuSmall(): void {
    this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.remove('is-active');
    this.graphs_left_menu_small.nativeElement.classList.add('w3-hide');
  }

  /**
   * Show left menu on small screens
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @private
   * @memberof GraphsComponent
   */
  private _showGraphLeftMenuSmall(): void {
    this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.add('is-active');
    this.graphs_left_menu_small.nativeElement.classList.remove('w3-hide');
  }

  /**
   * Handle click on quick links' sub-link
   *
   * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
   * @param {Event} event
   * @param {(string[] | string)} [link]
   * @param {boolean} [is_absolute]
   * @memberof GraphsComponent
   */
  onClickQuickLinkSublinks(event: Event, link?: string[] | string, is_absolute?: boolean): void {
    event.stopPropagation();
    if (link) {
      if (is_absolute && typeof link === 'string') {
        window.location.href = link;
      } else {
        this._router.navigate(link as string[]);
      }
    }
  }
}

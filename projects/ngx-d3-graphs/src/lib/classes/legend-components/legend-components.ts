import * as d3 from 'd3';
import * as d3Legends from 'd3-svg-legend';
import assignDeep from 'assign-deep';

import { LegendOptionsModel } from '../../data-models/legend-options/legend-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';

export class LegendComponents {
  static readonly DEFAULT_LEGEND_OPTIONS: LegendOptionsModel = assignDeep({}, DEFAULT_GRAPH_OPTIONS.legend);

  options: LegendOptionsModel;

  constructor(legend_options?: LegendOptionsModel) {
    const temp_legend_options: LegendOptionsModel = assignDeep({}, LegendComponents.DEFAULT_LEGEND_OPTIONS);
    console.log('temp_legend_options before', JSON.parse(JSON.stringify(temp_legend_options)));
    assignDeep(temp_legend_options, legend_options);
    console.log('temp_legend_options after', JSON.parse(JSON.stringify(temp_legend_options)));

    // console.log('d3Legends', d3Legends);

    this.options = temp_legend_options;
  }

  /**
   *
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg Parent SVG
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param keys Keys
   * @param colors Colors
   */
  renderOrdinalLegend(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    graph_width: number,
    graph_height: number,
    keys: string[],
    colors: string[]
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    if (this.options.show) {
      const legend: d3.Selection<SVGGElement, unknown, null, undefined> = svg
        .append('g')
        .attr('class', 'ngx-d3--legend')
        .attr('x', 0)
        .attr('y', 0);
      const legend_bg: d3.Selection<SVGGElement, unknown, null, undefined> = legend
        .append('rect')
        .attr('class', 'ngx-d3--legend--bg');
      const legend_ordinal: d3.Selection<SVGGElement, unknown, null, undefined> = legend
        .append('g')
        .attr('class', 'ngx-d3--legend--ordinal');

      const ordinal = d3
        .scaleOrdinal()
        .domain(keys)
        .range(colors);
      const legend_ordinal_cells = d3Legends
        .legendColor()
        .shape('circle')
        .shapeRadius(6)
        .shapePadding(0)
        .cellFilter((d => {
          return !this.options.hide.includes(d.label);
        }) as any);

      if (this.options.title && this.options.title.text) {
        legend_ordinal_cells.title(this.options.title.text);

        if (this.options.title.width && typeof this.options.title.width === 'number') {
          legend_ordinal_cells.titleWidth(this.options.title.width);
        }
      }

      if (this.options.onclick !== undefined) {
        legend_ordinal_cells.on('cellclick', (id: any) => {
          this.options.onclick(id);
        });
      }

      if (this.options.onmouseover !== undefined) {
        legend_ordinal_cells.on('cellover', (id: any) => {
          this.options.onmouseover(id);
        });
      }

      if (this.options.onmouseout !== undefined) {
        legend_ordinal_cells.on('cellout', (id: any) => {
          this.options.onmouseout(id);
        });
      }

      // legend_ordinal_cells.scale(ordinal);
      legend_ordinal.call(legend_ordinal_cells.scale(ordinal));

      legend_ordinal.select('.legendCells').attr('class', 'ngx-d3--legend--cells');
      if (
        this.options.onclick !== undefined ||
        this.options.onclick !== undefined ||
        this.options.onclick !== undefined
      ) {
        legend_ordinal.selectAll('.cell').attr('class', 'ngx-d3--legend--cell ngx-d3--legend--cell--interactable');
      } else {
        legend_ordinal.selectAll('.cell').attr('class', 'ngx-d3--legend--cell');
      }
      legend_ordinal.selectAll('.swatch').attr('class', 'ngx-d3--legend--swatch');
      legend_ordinal.selectAll('.label').attr('class', 'ngx-d3--legend--label');
      legend_ordinal.select('.legendTitle').attr('class', 'ngx-d3--legend--title');

      const legend_ordinal_bbox = JSON.parse(
        JSON.stringify({
          x: legend_ordinal.node().getBBox().x,
          y: legend_ordinal.node().getBBox().y,
          width: legend_ordinal.node().getBBox().width,
          height: legend_ordinal.node().getBBox().height
        })
      );

      legend_ordinal.attr('transform', `translate(${5 - legend_ordinal_bbox.x}, ${5 - legend_ordinal_bbox.y})`);

      legend_bg.attr('width', legend_ordinal_bbox.width + 10).attr('height', legend_ordinal_bbox.height + 10);

      if (this.options.position === 'inset') {
        let translate_legend: {
          x: number;
          y: number;
        };
        if (this.options.inset.anchor === 'bottom-left') {
          translate_legend = {
            x: this.options.inset.x ? this.options.inset.x : LegendComponents.DEFAULT_LEGEND_OPTIONS.inset.x,
            y:
              graph_height -
              legend.node().getBBox().height -
              (this.options.inset.y ? this.options.inset.y : LegendComponents.DEFAULT_LEGEND_OPTIONS.inset.y)
          };

          legend.attr('transform', `translate(${translate_legend.x}, ${translate_legend.y})`);
        } else if (this.options.inset.anchor === 'bottom-right') {
          translate_legend = {
            x:
              graph_width -
              legend.node().getBBox().width -
              (this.options.inset.x ? this.options.inset.x : LegendComponents.DEFAULT_LEGEND_OPTIONS.inset.x),
            y:
              graph_height -
              legend.node().getBBox().height -
              (this.options.inset.y ? this.options.inset.y : LegendComponents.DEFAULT_LEGEND_OPTIONS.inset.y)
          };

          legend.attr('transform', `translate(${translate_legend.x}, ${translate_legend.y})`);
        } else if (this.options.inset.anchor === 'top-left') {
          translate_legend = {
            x: this.options.inset.x ? this.options.inset.x : LegendComponents.DEFAULT_LEGEND_OPTIONS.inset.x,
            y: this.options.inset.y ? this.options.inset.y : LegendComponents.DEFAULT_LEGEND_OPTIONS.inset.y
          };

          legend.attr('transform', `translate(${translate_legend.x}, ${translate_legend.y})`);
        } else {
          translate_legend = {
            x:
              graph_width -
              legend.node().getBBox().width -
              (this.options.inset.x ? this.options.inset.x : LegendComponents.DEFAULT_LEGEND_OPTIONS.inset.x),
            y: this.options.inset.y ? this.options.inset.y : LegendComponents.DEFAULT_LEGEND_OPTIONS.inset.y
          };

          legend.attr('transform', `translate(${translate_legend.x}, ${translate_legend.y})`);
        }
      }

      return legend;
    }
    return;
  }
}
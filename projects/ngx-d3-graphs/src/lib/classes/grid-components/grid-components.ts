import * as d3 from 'd3';
import moment from 'moment';
import objectAssignDeep from 'object-assign-deep';

import { GraphOptionsModel } from '../../data-models/graph-options/graph-options.model';
import { GridOptionsModel } from '../../data-models/grid-options/grid-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';
import { HelperService } from '../../services/helper/helper.service';

export class GridComponents {
  static readonly DEFAULT_GRID_OPTIONS = objectAssignDeep({}, DEFAULT_GRAPH_OPTIONS.grid);

  options: GridOptionsModel;

  constructor(grid_options?: GridOptionsModel) {
    console.log('grid_options', grid_options);
    const temp_grid_options: GridOptionsModel = objectAssignDeep({}, GridComponents.DEFAULT_GRID_OPTIONS);
    console.log('temp_grid_options before', JSON.parse(JSON.stringify(temp_grid_options)));
    objectAssignDeep(temp_grid_options, grid_options);
    console.log('temp_grid_options before', JSON.parse(JSON.stringify(temp_grid_options)));

    this.options = temp_grid_options;
  }

  /**
   * Render gridlines for X Axis
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg parent SVG element
   * @param x X axis scals
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param [is_axis_rotated=DEFAULT_GRAPH_OPTIONS.axis.rotated] Flag is Axis rotated
   * @param [axis_type=DEFAULT_GRAPH_OPTIONS.axis.x.type] Axis type
   * @param [tick_values=DEFAULT_GRAPH_OPTIONS.axis.x.tick.values] Axis tick values
   * @param [tick_count=DEFAULT_GRAPH_OPTIONS.axis.x.tick.count] Axis tick count
   */
  renderXAxisGrids(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    graph_width: number,
    graph_height: number,
    is_axis_rotated: boolean = DEFAULT_GRAPH_OPTIONS.axis.rotated,
    axis_type: GraphOptionsModel['axis']['x']['type'] = DEFAULT_GRAPH_OPTIONS.axis.x.type,
    tick_values: GraphOptionsModel['axis']['x']['tick']['values'] = DEFAULT_GRAPH_OPTIONS.axis.x.tick.values,
    tick_count: GraphOptionsModel['axis']['x']['tick']['count'] = DEFAULT_GRAPH_OPTIONS.axis.x.tick.count
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    if (this.options.x.show) {
      let x_grids: d3.Axis<d3.AxisDomain>;

      if (is_axis_rotated) {
        x_grids = d3
          .axisLeft(x)
          .tickFormat((d, i) => '')
          .tickSize(-graph_width);
      } else {
        x_grids = d3
          .axisBottom(x)
          .tickFormat((d, i) => '')
          .tickSize(-graph_height);
      }
      if (axis_type === 'category') {
        if (tick_values && HelperService.array.isSubset(tick_values, x.domain())) {
          x_grids.tickValues(tick_values);
        } else {
          let tick_interval: number;
          if (is_axis_rotated) {
            tick_interval = (50 / graph_height) * x.domain().length;
          } else {
            tick_interval = (90 / graph_width) * x.domain().length;
          }
          x_grids.tickValues(HelperService.array.getElementsAtInterval(x.domain(), tick_interval));
        }
      } else {
        if (tick_values && HelperService.array.isInRange(tick_values, x.domain())) {
          x_grids.tickValues(tick_values);
        } else {
          x_grids.ticks(
            tick_count !== undefined && typeof tick_count === 'number'
              ? tick_count
              : is_axis_rotated === true
              ? Math.floor(graph_height / 50)
              : Math.floor(graph_width / 90)
          );
        }
      }

      const x_grids_svg = svg.append('g');
      const attr = {
        class: is_axis_rotated ? 'ngx-d3--grid ngx-d3--grid--rotated ngx-d3--grid--x' : 'ngx-d3--grid ngx-d3--grid--x',
        transform: is_axis_rotated ? 'translate(0, 0)' : 'translate(0,' + graph_height + ')'
      };

      return x_grids_svg
        .attr('class', attr.class)
        .attr('transform', attr.transform)
        .call(x_grids);
    }
    return;
  }

  renderXAxisLines(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    graph_width: number,
    graph_height: number,
    is_axis_rotated: boolean = DEFAULT_GRAPH_OPTIONS.axis.rotated,
    axis_type: GraphOptionsModel['axis']['x']['type'] = DEFAULT_GRAPH_OPTIONS.axis.x.type
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    if (this.options.x.lines && this.options.x.lines.length > 0) {
      const attr = {
        class: is_axis_rotated ? 'ngx-d3--line ngx-d3--line--rotated ngx-d3--line--x' : 'ngx-d3--line ngx-d3--line--x',
        transform: is_axis_rotated ? 'translate(0, 0)' : 'translate(0,' + graph_height + ')'
      };

      console.log('this.options.x.lines', this.options.x.lines);
      svg
        .selectAll('.ngx-d3--line--x')
        .data(this.options.x.lines)
        .enter()
        .append('line')
        .attr('class', attr.class)
        .attr('x1', d => {
          console.log('d', d);
          return is_axis_rotated ? 0 : x(axis_type === 'timeseries' ? moment(d.value).toDate() : (d.value as any));
        })
        .attr('x2', d => {
          return is_axis_rotated
            ? graph_width
            : x(axis_type === 'timeseries' ? moment(d.value).toDate() : (d.value as any));
        })
        .attr('y1', d => {
          return is_axis_rotated ? x(axis_type === 'timeseries' ? moment(d.value).toDate() : (d.value as any)) : 0;
        })
        .attr('y2', d => {
          return is_axis_rotated
            ? x(axis_type === 'timeseries' ? moment(d.value).toDate() : (d.value as any))
            : graph_height;
        });
    }
    return;
  }
}

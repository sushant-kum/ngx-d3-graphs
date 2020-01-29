import * as d3 from 'd3';
import moment from 'moment';
import assignDeep from 'assign-deep';

import { GraphOptionsModel } from '../../data-models/graph-options/graph-options.model';
import { GridOptionsModel } from '../../data-models/grid-options/grid-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';
import { HelperService } from '../../services/helper/helper.service';

export class GridComponents {
  static readonly DEFAULT_GRID_OPTIONS = assignDeep({}, DEFAULT_GRAPH_OPTIONS.grid);

  options: GridOptionsModel;

  constructor(grid_options?: GridOptionsModel) {
    const temp_grid_options: GridOptionsModel = assignDeep({}, GridComponents.DEFAULT_GRID_OPTIONS);
    console.log('temp_grid_options before', JSON.parse(JSON.stringify(temp_grid_options)));
    assignDeep(temp_grid_options, grid_options);
    console.log('temp_grid_options after', JSON.parse(JSON.stringify(temp_grid_options)));

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

  /**
   * Render X Axis grid-like lines
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg parent SVG element
   * @param x A axis scale
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param [is_axis_rotated=DEFAULT_GRAPH_OPTIONS.axis.rotated] Flag is axis rotated
   * @param [axis_type=DEFAULT_GRAPH_OPTIONS.axis.x.type] Graph type
   */
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
        class: is_axis_rotated ? 'ngx-d3--line ngx-d3--line--rotated ngx-d3--line--x' : 'ngx-d3--line ngx-d3--line--x'
      };

      const x_lines: d3.Selection<SVGGElement, unknown, null, undefined> = svg
        .append('g')
        .attr('class', 'ngx-d3--lines ngx-d3--lines--x');

      x_lines
        .selectAll('.ngx-d3--line--x')
        .data(this.options.x.lines)
        .enter()
        .append('line')
        .attr('class', d => `${attr.class} ${d.class}`)
        .attr('x1', d => {
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

      return x_lines;
    }
    return;
  }

  /**
   * Render X Axis grid-like line labels
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg parent SVG element
   * @param x A axis scale
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param [is_axis_rotated=DEFAULT_GRAPH_OPTIONS.axis.rotated] Flag is axis rotated
   * @param [axis_type=DEFAULT_GRAPH_OPTIONS.axis.x.type] Graph type
   */
  renderXAxisLineLabels(
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
        class: is_axis_rotated
          ? 'ngx-d3--line--label ngx-d3--line--label--rotated ngx-d3--line--label--x'
          : 'ngx-d3--line--label ngx-d3--line--label--x'
      };

      const x_labels: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append('g');

      if (is_axis_rotated) {
        x_labels.attr('class', 'ngx-d3--line--labels ngx-d3--line--labels--rotated ngx-d3--line--labels--x');
        for (const line of this.options.x.lines) {
          let label_dx: number;
          let label_dy: number;

          const x_label = x_labels
            .append('text')
            .text(line.text)
            .attr('class', `${attr.class} ${line.class}`);

          if (line.position === 'start') {
            label_dx = 5;
          } else if (line.position === 'middle') {
            label_dx = graph_width / 2 - x_label.node().getBBox().width / 2;
          } else {
            label_dx = graph_width - x_label.node().getBBox().width;
          }

          label_dy = -5;

          x_label
            .attr('y', x(axis_type === 'timeseries' ? moment(line.value).toDate() : (line.value as any)))
            .attr('dx', label_dx)
            .attr('dy', label_dy);
        }
      } else {
        x_labels.attr('class', 'ngx-d3--line--labels ngx-d3--line--labels--x');
        for (const line of this.options.x.lines) {
          let label_dx: number;
          let label_dy: number;

          const x_label = x_labels
            .append('text')
            .text(line.text)
            .attr('class', `${attr.class} ${line.class}`);

          if (line.position === 'start') {
            label_dx = -graph_height + 5;
          } else if (line.position === 'middle') {
            label_dx = -graph_height / 2 - x_label.node().getBBox().width / 2;
          } else {
            label_dx = -x_label.node().getBBox().width;
          }

          label_dy = x_label.node().getBBox().height;

          x_label
            .attr('transform', 'rotate(-90)')
            .attr(
              'transform-origin',
              `${x(axis_type === 'timeseries' ? moment(line.value).toDate() : (line.value as any))}px 0px`
            )
            .attr('x', x(axis_type === 'timeseries' ? moment(line.value).toDate() : (line.value as any)))
            .attr('dx', label_dx)
            .attr('dy', label_dy);
        }
      }

      return x_labels;
    }
    return;
  }

  /**
   * Render gridlines for Y Axis
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg parent SVG element
   * @param y Y axis scals
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param [is_axis_rotated=DEFAULT_GRAPH_OPTIONS.axis.rotated] Flag is Axis rotated
   * @param [axis_type=DEFAULT_GRAPH_OPTIONS.axis.y.type] Axis type
   * @param [tick_values=DEFAULT_GRAPH_OPTIONS.axis.y.tick.values] Axis tick values
   * @param [tick_count=DEFAULT_GRAPH_OPTIONS.axis.y.tick.count] Axis tick count
   */
  renderYAxisGrids(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    y:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    graph_width: number,
    graph_height: number,
    is_axis_rotated: boolean = DEFAULT_GRAPH_OPTIONS.axis.rotated,
    tick_values: GraphOptionsModel['axis']['y']['tick']['values'] = DEFAULT_GRAPH_OPTIONS.axis.y.tick.values,
    tick_count: GraphOptionsModel['axis']['y']['tick']['count'] = DEFAULT_GRAPH_OPTIONS.axis.y.tick.count
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    if (this.options.y.show) {
      let y_grids: d3.Axis<d3.AxisDomain>;

      if (is_axis_rotated) {
        y_grids = d3
          .axisBottom(y)
          .tickFormat((d, i) => '')
          .tickSize(-graph_height);
      } else {
        y_grids = d3
          .axisLeft(y)
          .tickFormat((d, i) => '')
          .tickSize(-graph_width);
      }

      if (tick_values && HelperService.array.isInRange(tick_values, y.domain())) {
        y_grids.tickValues(tick_values);
      } else {
        y_grids.ticks(
          tick_count !== undefined && typeof tick_count === 'number'
            ? tick_count
            : is_axis_rotated
            ? Math.floor(graph_width / 90)
            : Math.floor(graph_height / 50)
        );
      }

      const y_grids_svg = svg.append('g');
      const attr = {
        class: is_axis_rotated ? 'ngx-d3--grid ngx-d3--grid--rotated ngx-d3--grid--y' : 'ngx-d3--grid ngx-d3--grid--y',
        transform: is_axis_rotated ? 'translate(0,' + graph_height + ')' : 'translate(0, 0)'
      };

      return y_grids_svg
        .attr('class', attr.class)
        .attr('transform', attr.transform)
        .call(y_grids);
    }
    return;
  }

  /**
   * Render Y Axis grid-like lines
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg parent SVG element
   * @param y Y axis scale
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param [is_axis_rotated=DEFAULT_GRAPH_OPTIONS.axis.rotated] Flag is axis rotated
   * @param [axis_type=DEFAULT_GRAPH_OPTIONS.axis.y.type] Graph type
   */
  renderYAxisLines(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    y:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    graph_width: number,
    graph_height: number,
    is_axis_rotated: boolean = DEFAULT_GRAPH_OPTIONS.axis.rotated,
    axis_type: GraphOptionsModel['axis']['y']['type'] = DEFAULT_GRAPH_OPTIONS.axis.y.type
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    if (this.options.y.lines && this.options.y.lines.length > 0) {
      const attr = {
        class: is_axis_rotated ? 'ngx-d3--line ngx-d3--line--rotated ngx-d3--line--y' : 'ngx-d3--line ngx-d3--line--y'
      };

      const y_lines: d3.Selection<SVGGElement, unknown, null, undefined> = svg
        .append('g')
        .attr('class', 'ngx-d3--lines ngx-d3--lines--y');

      y_lines
        .selectAll('.ngx-d3--line--y')
        .data(this.options.y.lines)
        .enter()
        .append('line')
        .attr('class', d => {
          return `${attr.class} ${d.class}`;
        })
        .attr('x1', d => {
          return is_axis_rotated ? y(axis_type === 'timeseries' ? moment(d.value).toDate() : (d.value as any)) : 0;
        })
        .attr('x2', d => {
          return is_axis_rotated
            ? y(axis_type === 'timeseries' ? moment(d.value).toDate() : (d.value as any))
            : graph_width;
        })
        .attr('y1', d => {
          return is_axis_rotated ? 0 : y(axis_type === 'timeseries' ? moment(d.value).toDate() : (d.value as any));
        })
        .attr('y2', d => {
          return is_axis_rotated
            ? graph_height
            : y(axis_type === 'timeseries' ? moment(d.value).toDate() : (d.value as any));
        });

      return y_lines;
    }
    return;
  }

  /**
   * Render Y Axis grid-like line labels
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg parent SVG element
   * @param y Y axis scale
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param [is_axis_rotated=DEFAULT_GRAPH_OPTIONS.axis.rotated] Flag is axis rotated
   * @param [axis_type=DEFAULT_GRAPH_OPTIONS.axis.y.type] Graph type
   */
  renderYAxisLineLabels(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    y:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    graph_width: number,
    graph_height: number,
    is_axis_rotated: boolean = DEFAULT_GRAPH_OPTIONS.axis.rotated,
    axis_type: GraphOptionsModel['axis']['y']['type'] = DEFAULT_GRAPH_OPTIONS.axis.y.type
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    if (this.options.y.lines && this.options.y.lines.length > 0) {
      const attr = {
        class: is_axis_rotated
          ? 'ngx-d3--line--label ngx-d3--line--label--rotated ngx-d3--line--label--y'
          : 'ngx-d3--line--label ngx-d3--line--label--y'
      };

      const y_labels: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append('g');

      if (is_axis_rotated) {
        y_labels.attr('class', 'ngx-d3--line--labels ngx-d3--line--labels--rotated ngx-d3--line--labels--y');
        for (const line of this.options.y.lines) {
          let label_dx: number;
          let label_dy: number;
          const y_label = y_labels
            .append('text')
            .text(line.text)
            .attr('class', `${attr.class} ${line.class}`);

          if (line.position === 'start') {
            label_dx = -graph_height + 5;
          } else if (line.position === 'middle') {
            label_dx = -graph_height / 2 - y_label.node().getBBox().width / 2;
          } else {
            label_dx = -y_label.node().getBBox().width;
          }

          label_dy = y_label.node().getBBox().height;

          y_label
            .attr('transform', 'rotate(-90)')
            .attr(
              'transform-origin',
              `${y(axis_type === 'timeseries' ? moment(line.value).toDate() : (line.value as any))}px 0px`
            )
            .attr('x', y(axis_type === 'timeseries' ? moment(line.value).toDate() : (line.value as any)))
            .attr('dx', label_dx)
            .attr('dy', label_dy);
        }
      } else {
        y_labels.attr('class', 'ngx-d3--line--labels ngx-d3--line--labels--y');
        for (const line of this.options.y.lines) {
          console.log('grid.y.line', line);
          let label_dx: number;
          let label_dy: number;

          const y_label = y_labels
            .append('text')
            .text(line.text)
            .attr('class', `${attr.class} ${line.class}`);

          if (line.position === 'start') {
            label_dx = 5;
          } else if (line.position === 'middle') {
            label_dx = graph_width / 2 - y_label.node().getBBox().width / 2;
          } else {
            label_dx = graph_width - y_label.node().getBBox().width;
          }

          label_dy = -5;

          y_label
            .attr('y', y(axis_type === 'timeseries' ? moment(line.value).toDate() : (line.value as any)))
            .attr('dx', label_dx)
            .attr('dy', label_dy);
        }
      }

      return y_labels;
    }
    return;
  }
}

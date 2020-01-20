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
    const temp_grid_options: GridOptionsModel = objectAssignDeep({}, GridComponents.DEFAULT_GRID_OPTIONS);
    objectAssignDeep(temp_grid_options, grid_options);

    this.options = temp_grid_options;
  }

  renderXAxisGridLines(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    x_axis: d3.Axis<d3.AxisDomain>,
    graph_width: number,
    graph_height: number,
    is_axis_rotated: boolean = false
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    // if (this.options.x.show) {
    //   const x_gridlines = d3
    //     .axisBottom(x)
    //     .tickFormat((d, i) => '')
    //     .tickSize(is_axis_rotated ? -graph_width : -graph_height)
    //     .tickSizeOuter(0);

    //   const x_gridlines_svg = svg.append('g');
    //   const attr = {
    //     class: is_axis_rotated ? 'ngx-d3--grid ngx-d3--grid--rotated ngx-d3--grid--x' : 'ngx-d3--grid ngx-d3--grid--x',
    //     transform: is_axis_rotated ? 'translate(0, 0)' : 'translate(0,' + graph_height + ')'
    //   };

    //   return x_gridlines_svg
    //     .attr('class', attr.class)
    //     .attr('transform', attr.transform)
    //     .call(x_gridlines);
    // }
    // return;
    return;
  }
}

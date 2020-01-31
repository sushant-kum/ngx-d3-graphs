import * as d3 from 'd3';
import { AxisDomain } from 'd3';
import moment from 'moment';

import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';
import { RegionOptionsModel } from '../../data-models/region-options/region-options.model';
import { GraphOptionsModel } from '../../data-models/graph-options/graph-options.model';

export class RegionComponents {
  static readonly DEFAULT_REGIONS_OPTIONS = DEFAULT_GRAPH_OPTIONS.regions;

  options: RegionOptionsModel[];

  constructor(regions_options?: RegionOptionsModel[]) {
    if (regions_options && regions_options.length > 0) {
      this.options = regions_options;
    } else {
      this.options = RegionComponents.DEFAULT_REGIONS_OPTIONS;
    }
  }

  /**
   * Render the regions
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg Base SVG element
   * @param x X axis scale
   * @param y Y axis scale
   * @param graph_width Graph width
   * @param graph_height Grph height
   * @param [is_axis_rotated=DEFAULT_GRAPH_OPTIONS.axis.rotated] Flag is axis rotated
   * @param [axis_type_x=DEFAULT_GRAPH_OPTIONS.axis.x.type] Axis type of X axis
   * @param [axis_type_y=DEFAULT_GRAPH_OPTIONS.axis.y.type] Axis type of Y axis
   */
  renderRegions(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    y: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>,
    graph_width: number,
    graph_height: number,
    is_axis_rotated: boolean = DEFAULT_GRAPH_OPTIONS.axis.rotated,
    axis_type_x: GraphOptionsModel['axis']['x']['type'] = DEFAULT_GRAPH_OPTIONS.axis.x.type,
    axis_type_y: GraphOptionsModel['axis']['y']['type'] = DEFAULT_GRAPH_OPTIONS.axis.y.type
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    if (this.options && this.options.length > 0) {
      const attr = {
        class: {
          x: is_axis_rotated
            ? 'ngx-d3--region ngx-d3--region--rotated ngx-d3--region--x'
            : 'ngx-d3--region ngx-d3--region--x',
          y: is_axis_rotated
            ? 'ngx-d3--region ngx-d3--region--rotated ngx-d3--region--y'
            : 'ngx-d3--region ngx-d3--region--y'
        }
      };

      const regions: d3.Selection<SVGGElement, unknown, null, undefined> = svg
        .append('g')
        .lower()
        .attr('class', 'ngx-d3--regions');

      for (const region of this.options) {
        const region_svg = regions.append('rect');

        if (region.axis === 'x') {
          let x0: number;
          let y0: number;
          let width: number;
          let height: number;

          if (is_axis_rotated) {
            const y1 = x(
              axis_type_x === 'timeseries'
                ? moment(region.start ? region.start : (x.domain()[0] as number)).toDate()
                : region.start
                ? region.start
                : (x.domain()[0] as any)
            );
            const y2 = x(
              axis_type_x === 'timeseries'
                ? moment(region.end ? region.end : (x.domain()[0] as number)).toDate()
                : region.end
                ? region.end
                : (x.domain()[1] as any)
            );
            const x1 = 0;
            const x2 = graph_width;

            x0 = x1;
            y0 = y1;
            width = Math.abs(x2 - x1);
            height = Math.abs(y2 - y1);

            region_svg
              .attr('class', `${attr.class.x} ${region.class}`)
              .attr('x', x0)
              .attr('y', y0 - height)
              .attr('width', width)
              .attr('height', height);
          } else {
            const x1 = x(
              axis_type_x === 'timeseries'
                ? moment(region.start ? region.start : (x.domain()[0] as number)).toDate()
                : region.start
                ? region.start
                : (x.domain()[0] as any)
            );
            const x2 = x(
              axis_type_x === 'timeseries'
                ? moment(region.end ? region.end : (x.domain()[0] as number)).toDate()
                : region.end
                ? region.end
                : (x.domain()[1] as any)
            );
            const y1 = 0;
            const y2 = graph_height;

            x0 = x1;
            y0 = y1;
            width = Math.abs(x2 - x1);
            height = Math.abs(y2 - y1);

            region_svg
              .attr('class', `${attr.class.x} ${region.class}`)
              .attr('x', x0)
              .attr('y', y0)
              .attr('width', width)
              .attr('height', height);
          }
        } else if (region.axis === 'y') {
          let x0: number;
          let y0: number;
          let width: number;
          let height: number;

          if (is_axis_rotated) {
            const x1 = y(
              axis_type_y === 'timeseries'
                ? moment(region.start ? region.start : (y.domain()[0] as number)).toDate()
                : region.start
                ? region.start
                : (y.domain()[0] as any)
            );
            const x2 = y(
              axis_type_y === 'timeseries'
                ? moment(region.end ? region.end : (y.domain()[0] as number)).toDate()
                : region.end
                ? region.end
                : (y.domain()[1] as any)
            );
            const y1 = 0;
            const y2 = graph_height;

            x0 = x1;
            y0 = y1;
            width = Math.abs(x2 - x1);
            height = Math.abs(y2 - y1);

            region_svg
              .attr('class', `${attr.class.y} ${region.class}`)
              .attr('x', x0)
              .attr('y', y0)
              .attr('width', width)
              .attr('height', height);
          } else {
            const y1 = y(
              axis_type_y === 'timeseries'
                ? moment(region.start ? region.start : (y.domain()[0] as number)).toDate()
                : region.start
                ? region.start
                : (y.domain()[0] as any)
            );
            const y2 = y(
              axis_type_y === 'timeseries'
                ? moment(region.end ? region.end : (y.domain()[0] as number)).toDate()
                : region.end
                ? region.end
                : (y.domain()[1] as any)
            );
            const x1 = 0;
            const x2 = graph_width;

            x0 = x1;
            y0 = y1;
            width = Math.abs(x2 - x1);
            height = Math.abs(y2 - y1);

            region_svg
              .attr('class', `${attr.class.y} ${region.class}`)
              .attr('x', x0)
              .attr('y', y0 - height)
              .attr('width', width)
              .attr('height', height);
          }
        }
      }
      return regions;
    }
    return;
  }
}

import objectAssignDeep from 'object-assign-deep';
import * as d3 from 'd3';
import moment from 'moment';

import { AxisOptionsModel } from '../../data-models/axis-options/axis-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';
import { HelperService } from '../../services/helper/helper.service';

export class AxisComponents {
  static readonly DEFAULT_AXIS_OPTIONS = objectAssignDeep({}, DEFAULT_GRAPH_OPTIONS.axis);

  options: AxisOptionsModel;

  constructor(axis_options?: AxisOptionsModel) {
    const temp_axis_options: AxisOptionsModel = objectAssignDeep({}, AxisComponents.DEFAULT_AXIS_OPTIONS);
    console.log('temp_axis_options before', JSON.parse(JSON.stringify(temp_axis_options)));
    objectAssignDeep(temp_axis_options, axis_options);
    console.log('temp_axis_options after', JSON.parse(JSON.stringify(temp_axis_options)));

    this.options = temp_axis_options;
  }

  getXAxis(
    domain: (Date | number | string | { valueOf(): number })[],
    graph_width: number,
    graph_height: number
  ):
    | d3.ScaleTime<number, number>
    | d3.ScaleLinear<number, number>
    | d3.ScalePoint<string>
    | d3.AxisScale<d3.AxisDomain> {
    let x:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>;
    if (this.options.x.type === 'timeseries') {
      x = d3
        .scaleTime()
        .range(this.options.rotated ? [graph_height, 0] : [0, graph_width])
        .domain(this.getXAxisDomain(domain) as any);
    } else if (this.options.x.type === 'category') {
      x = d3
        .scalePoint()
        .range(this.options.rotated ? [graph_height, 0] : [0, graph_width])
        .domain(this.getXAxisDomain(domain) as any);
    } else if (this.options.x.type === 'indexed') {
      x = d3
        .scaleLinear()
        .range(this.options.rotated ? [graph_height, 0] : [0, graph_width])
        .domain(this.getXAxisDomain(domain) as any);
    }

    console.log('this.getXAxisDomain(domain)', this.getXAxisDomain(domain));
    // x.domain(this.getXAxisDomain(domain) as any);
    return x;
  }

  getXAxisDomain(
    domain: (Date | number | string | { valueOf(): number })[]
  ): (Date | number | string | { valueOf(): number })[] {
    if (this.options.x.type !== 'category' && (this.options.x.min !== undefined || this.options.x.min !== undefined)) {
      const computed_domain: (Date | number | string | { valueOf(): number })[] = [undefined, undefined];
      if (this.options.x.min !== undefined) {
        if (this.options.x.type === 'timeseries') {
          computed_domain[0] = moment(this.options.x.min, 'YYYY-MM-DD').toDate();
        } else {
          computed_domain[0] = domain[0];
        }
      }
      if (this.options.x.max !== undefined) {
        if (this.options.x.type === 'timeseries') {
          computed_domain[1] = moment(this.options.x.max, 'YYYY-MM-DD').toDate();
        } else {
          computed_domain[1] = domain[1];
        }
      }
      return computed_domain;
    } else {
      return domain;
    }
  }

  renderXAxis(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    graph_width: number,
    graph_height: number
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    const x_axis = svg.append('g');
    const attr = {
      class: this.options.rotated
        ? 'ngx-d3--axis ngx-d3--axis--rotated ngx-d3--axis--x'
        : 'ngx-d3--axis ngx-d3--axis--x',
      transform: this.options.rotated ? 'translate(0, 0)' : 'translate(0,' + graph_height + ')'
    };

    const axis = this.options.rotated ? d3.axisLeft(x) : d3.axisBottom(x);

    /**
     * Ticks
     */
    // x.tick.format
    if (this.options.x.tick.format) {
      axis.tickFormat(this.options.x.tick.format);
    }

    // x.ticks.values, x.tick.count
    if (this.options.x.type === 'category') {
      if (this.options.x.tick.values && HelperService.array.isSubset(this.options.x.tick.values, x.domain())) {
        axis.tickValues(this.options.x.tick.values);
      } else {
        let tick_interval: number;
        if (this.options.rotated) {
          tick_interval = (50 / graph_height) * x.domain().length;
        } else {
          tick_interval = (90 / graph_width) * x.domain().length;
        }
        axis.tickValues(HelperService.array.getElementsAtInterval(x.domain(), tick_interval));
      }
    } else {
      if (this.options.x.tick.values && HelperService.array.isInRange(this.options.x.tick.values, x.domain())) {
        axis.tickValues(this.options.x.tick.values);
      } else {
        axis.ticks(
          this.options.x.tick.count !== undefined && typeof this.options.x.tick.count === 'number'
            ? this.options.x.tick.count
            : this.options.rotated === true
            ? Math.floor(graph_height / 50)
            : Math.floor(graph_width / 90)
        );
      }
    }

    // x.tick.outer
    if (!this.options.x.tick.outer) {
      axis.tickSizeOuter(0);
    }

    x_axis
      .attr('class', attr.class)
      .attr('transform', attr.transform)
      .call(axis);

    // x.tick.rotate
    if (this.options.x.tick.rotate && !this.options.rotated) {
      x_axis
        .selectAll('text')
        .attr('y', 0)
        .attr('x', 9)
        .attr('dy', '.35em')
        .attr('transform', `rotate(${this.options.x.tick.rotate})`)
        .style('text-anchor', 'start');
    }

    /**
     * Position X axis
     */

    return x_axis;
  }
}

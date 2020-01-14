import objectAssignDeep from 'object-assign-deep';
import * as d3 from 'd3';
import moment from 'moment';

import { GraphOptionsModel } from '../../data-models/graph-options/graph-options.model';
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
    // x.min, x.max
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
    graph_height: number,
    padding: GraphOptionsModel['padding']
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

    // x.tick.multiline
    if (this.options.x.tick.multiline) {
      if (this.options.rotated && padding.left) {
        x_axis.selectAll('.tick text').call(this._wrapVerticalXTick, padding.left);
      } else {
        x_axis.selectAll('.tick text').call(this._wrapHorizontalXTick, x.range()[1] - x.range()[0]);
      }
    }

    // x.show
    if (!this.options.x.show) {
      x_axis.attr('display', 'none');
    }
    return x_axis;
  }

  /**
   * Renders X Axis
   *
   * @author Sushant Kumar<sushant.kumar@soroco.com>
   * @param svg Parent SVG element
   * @param x_axis X Axis SVG element
   * @param graph_width Width of the graph in px
   * @param graph_height Height of the graph in px
   * @param label Label text and position
   * @returns
   */
  renderXAxisLabel(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x_axis: d3.Selection<SVGGElement, unknown, null, undefined>,
    graph_width: number,
    graph_height: number,
    label: AxisOptionsModel['x']['label']
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    const x_label: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append('text').text(label.text);
    console.log("this.options.x.label.position.split('-')", this.options.x.label.position.split('-'));
    if (this.options.rotated) {
      let label_x_position: number;
      let label_dx: number;
      let label_dy: number;

      x_label.attr('class', 'ngx-d3--label ngx-d3--label--rotated ngx-d3--label--x').attr('transform', 'rotate(-90)');

      if (this.options.x.label.position.split('-')[0] === 'outer') {
        label_dy = -x_axis.node().getBBox().width;
      } else {
        label_dy = x_label.node().getBBox().height;
      }

      if (this.options.x.label.position.split('-')[1] === 'bottom') {
        label_x_position = -graph_height;
        label_dx = 2;
      } else if (this.options.x.label.position.split('-')[1] === 'middle') {
        label_x_position = -graph_height / 2;
        label_dx = -x_label.node().getBBox().width / 2;
      } else {
        label_x_position = 0;
        label_dx = -x_label.node().getBBox().width;
      }

      x_label
        .attr('x', label_x_position)
        .attr('dx', label_dx)
        .attr('dy', label_dy);
    } else {
      let text_anchor: 'start' | 'middle' | 'end';
      let label_x_position: number;
      let label_y_position: number;

      x_label.attr('class', 'ngx-d3--label ngx-d3--label--x');

      if (this.options.x.label.position.split('-')[0] === 'outer') {
        label_y_position = graph_height + 27;
      } else {
        label_y_position = graph_height - 5;
      }

      if (this.options.x.label.position.split('-')[1] === 'left') {
        text_anchor = 'start';
        label_x_position = 2;
      } else if (this.options.x.label.position.split('-')[1] === 'center') {
        text_anchor = 'middle';
        label_x_position = graph_width / 2;
      } else {
        text_anchor = 'end';
        label_x_position = graph_width;
      }

      x_label
        .attr('text-anchor', text_anchor)
        .attr('x', label_x_position)
        .attr('y', label_y_position);
    }
    return x_label;
  }

  private _wrapHorizontalXTick(text: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>, width: number): void {
    const tick_width: number = width / text.size();
    text.each(function() {
      const d3_text = d3.select(this);

      const words = d3_text
        .text()
        .toString()
        .split(/\s+/)
        .reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const y = d3_text.attr('y');
      const dy = parseFloat(d3_text.attr('dy'));
      let tspan = d3_text
        .text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('y', y)
        .attr('dy', dy + 'em');
      // tslint:disable-next-line: no-conditional-assignment
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > tick_width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = d3_text
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });
  }

  private _wrapVerticalXTick(
    text: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>,
    left_padding: number
  ): void {
    const tick_width: number = left_padding - 6;
    text.each(function() {
      const d3_text = d3.select(this);

      const words = d3_text
        .text()
        .toString()
        .split(/\s+/)
        .reverse();
      let word: string;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const dy = parseFloat(d3_text.attr('dy'));
      let tspan = d3_text
        .text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dx', -6)
        .attr('dy', dy + 'em');
      // tslint:disable-next-line: no-conditional-assignment
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > tick_width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = d3_text
            .append('tspan')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dx', -6)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });
  }
}

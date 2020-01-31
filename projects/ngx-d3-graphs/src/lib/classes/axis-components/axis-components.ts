/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2020-01-15 10:52:20
 * @modify date 2020-01-15 10:52:20
 * @desc Axis component
 */
import * as d3 from 'd3';
import moment from 'moment';
import assignDeep from 'assign-deep';

import { GraphOptionsModel } from '../../data-models/graph-options/graph-options.model';
import { AxisOptionsModel } from '../../data-models/axis-options/axis-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';
import { HelperService } from '../../services/helper/helper.service';

/**
 * Class AxisComponents
 *
 * @author Sushant Kumar<sushant.kum96@gmail.com>
 * @export
 */
export class AxisComponents {
  static readonly DEFAULT_AXIS_OPTIONS = assignDeep({}, DEFAULT_GRAPH_OPTIONS.axis);

  options: AxisOptionsModel;

  constructor(axis_options?: AxisOptionsModel) {
    const temp_axis_options: AxisOptionsModel = assignDeep({}, AxisComponents.DEFAULT_AXIS_OPTIONS);
    assignDeep(temp_axis_options, axis_options);

    this.options = temp_axis_options;
  }

  /**
   * Create and return D3 X axis
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param domain Data-wise domain for X axis
   * @param graph_width Graph width
   * @param graph_height Graph height
   */
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

    return x;
  }

  /**
   * Get actual domain of X axis
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param domain Data-wise domain
   */
  getXAxisDomain(
    domain: (Date | number | string | { valueOf(): number })[]
  ): (Date | number | string | { valueOf(): number })[] {
    // x.min, x.max
    if (this.options.x.type !== 'category' && (this.options.x.min !== undefined || this.options.x.max !== undefined)) {
      const computed_domain: (Date | number | string | { valueOf(): number })[] = [undefined, undefined];
      if (this.options.x.min || this.options.x.min === 0) {
        if (this.options.x.type === 'timeseries') {
          computed_domain[0] = moment(this.options.x.min).toDate();
        } else {
          computed_domain[0] = this.options.x.min;
        }
      } else {
        computed_domain[0] = domain[0];
      }
      if (this.options.x.max || this.options.x.max === 0) {
        if (this.options.x.type === 'timeseries') {
          computed_domain[1] = moment(this.options.x.max).toDate();
        } else {
          computed_domain[1] = this.options.x.max;
        }
      } else {
        computed_domain[1] = domain[1];
      }
      return computed_domain;
    } else {
      return domain;
    }
  }

  /**
   * Render X axis
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param svg Parent SVG element
   * @param x D3 X axis element
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param padding Graph padding object
   */
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
  ): { x_axis_svg: d3.Selection<SVGGElement, unknown, null, undefined>; x_axis: d3.Axis<d3.AxisDomain> } {
    const x_axis_svg = svg.append('g');
    const attr = {
      class: this.options.rotated
        ? 'ngx-d3--axis ngx-d3--axis--rotated ngx-d3--axis--x'
        : 'ngx-d3--axis ngx-d3--axis--x',
      transform: this.options.rotated ? 'translate(0, 0)' : 'translate(0,' + graph_height + ')'
    };

    const x_axis = this.options.rotated ? d3.axisLeft(x) : d3.axisBottom(x);

    /**
     * Ticks
     */
    // x.tick.format
    if (this.options.x.tick.format) {
      x_axis.tickFormat(this.options.x.tick.format);
    }

    // x.ticks.values, x.tick.count
    if (this.options.x.type === 'category') {
      if (this.options.x.tick.values && HelperService.array.isSubset(this.options.x.tick.values, x.domain())) {
        x_axis.tickValues(this.options.x.tick.values);
      } else {
        let tick_interval: number;
        if (this.options.rotated) {
          tick_interval = (50 / graph_height) * x.domain().length;
        } else {
          tick_interval = (90 / graph_width) * x.domain().length;
        }
        x_axis.tickValues(HelperService.array.getElementsAtInterval(x.domain(), tick_interval));
      }
    } else {
      if (this.options.x.tick.values && HelperService.array.isInRange(this.options.x.tick.values, x.domain())) {
        x_axis.tickValues(this.options.x.tick.values);
      } else {
        x_axis.ticks(
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
      x_axis.tickSizeOuter(0);
    }

    x_axis_svg
      .attr('class', attr.class)
      .attr('transform', attr.transform)
      .call(x_axis);

    // x.tick.rotate
    if (this.options.x.tick.rotate && !this.options.rotated) {
      x_axis_svg
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
        x_axis_svg.selectAll('.tick text').call(this._wrapVerticalXTick, padding.left);
      } else {
        x_axis_svg.selectAll('.tick text').call(this._wrapHorizontalXTick, x.range()[1] - x.range()[0]);
      }
    }

    // x.show
    if (!this.options.x.show) {
      x_axis_svg.attr('display', 'none');
    }
    return { x_axis_svg, x_axis };
  }

  /**
   * Renders X Axis label
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param svg Parent SVG element
   * @param x_axis_svg X Axis SVG element
   * @param graph_width Width of the graph in px
   * @param graph_height Height of the graph in px
   * @param label Label text and position
   * @returns
   */
  renderXAxisLabel(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    x_axis_svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    graph_width: number,
    graph_height: number,
    label: AxisOptionsModel['x']['label']
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    const x_label: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append('text').text(label.text);
    if (this.options.rotated) {
      let label_x_position: number;
      let label_dx: number;
      let label_dy: number;

      x_label.attr('class', 'ngx-d3--label ngx-d3--label--rotated ngx-d3--label--x').attr('transform', 'rotate(-90)');

      if (this.options.x.label.position.split('-')[0] === 'outer') {
        label_dy = -x_axis_svg.node().getBBox().width;
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
        label_x_position = 5;
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

  /**
   * Wrap tick text for horizontal X axis
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param text Tick Text
   * @param width Width of axis
   */
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

  /**
   * Wrap text for vertical X axis
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param text
   * @param left_padding
   */
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

  /**
   * Get linear D3 X Axis object
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param domain Data-wise domain
   * @param graph_width Graph width
   * @param graph_height Graph height
   */
  getLinearYAxis(
    domain: [number, number] | [Date, Date],
    graph_width: number,
    graph_height: number
  ): d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain> {
    let y: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
    // y.inverted
    const computed_domain = this.options.y.inverted
      ? this.getLinearYAxisDomain(domain).reverse()
      : this.getLinearYAxisDomain(domain);
    if (this.options.y.type === 'timeseries') {
      y = d3
        .scaleTime()
        .range(this.options.rotated ? [0, graph_width] : [graph_height, 0])
        .domain(computed_domain);
    } else if (this.options.y.type === 'linear') {
      y = d3
        .scaleLinear()
        .range(this.options.rotated ? [0, graph_width] : [graph_height, 0])
        .domain(computed_domain);
    }

    return y;
  }

  /**
   * Get linear domain for Y Axis
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param domain Data-wise domain
   */
  getLinearYAxisDomain(domain: [number, number] | [Date, Date]): [number, number] | [Date, Date] {
    // y.min, y.max
    if (this.options.y.min !== undefined || this.options.y.max !== undefined) {
      const computed_domain: [number, number] | [Date, Date] = [undefined, undefined];
      if (this.options.y.min || this.options.y.min === 0) {
        if (this.options.y.type === 'timeseries') {
          computed_domain[0] = moment(this.options.y.min).toDate();
        } else {
          computed_domain[0] = this.options.y.min;
        }
      } else {
        computed_domain[0] = domain[0];
      }
      if (this.options.y.max || this.options.y.max === 0) {
        if (this.options.y.type === 'timeseries') {
          computed_domain[1] = moment(this.options.y.max).toDate();
        } else {
          computed_domain[1] = this.options.y.max;
        }
      } else {
        computed_domain[1] = domain[1];
      }
      return computed_domain;
    } else {
      return domain;
    }
  }

  /**
   * Render Y axis
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param svg Parent SVG element
   * @param y D3 Y axis object
   * @param graph_width Graph width
   * @param graph_height Graph height
   */
  renderYAxis(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    y:
      | d3.ScaleTime<number, number>
      | d3.ScaleLinear<number, number>
      | d3.ScalePoint<string>
      | d3.AxisScale<d3.AxisDomain>,
    graph_width: number,
    graph_height: number
  ): { y_axis_svg: d3.Selection<SVGGElement, unknown, null, undefined>; y_axis: d3.Axis<d3.AxisDomain> } {
    const y_axis_svg: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append('g');
    const attr = {
      class: this.options.rotated
        ? 'ngx-d3--axis ngx-d3--axis--rotated ngx-d3--axis--y'
        : 'ngx-d3--axis ngx-d3--axis--y',
      transform: this.options.rotated ? 'translate(0,' + graph_height + ')' : 'translate(0, 0)'
    };

    const y_axis: d3.Axis<d3.AxisDomain> = this.options.rotated
      ? d3.axisBottom(y)
      : this.options.y.inner
      ? d3.axisRight(y)
      : d3.axisLeft(y);

    /**
     * Ticks
     */
    // y.tick.format
    if (this.options.y.tick.format) {
      y_axis.tickFormat(this.options.y.tick.format);
    }

    // y.tick.values, y.tick.count
    if (this.options.y.tick.values && HelperService.array.isInRange(this.options.y.tick.values, y.domain())) {
      y_axis.tickValues(this.options.y.tick.values);
    } else {
      y_axis.ticks(
        this.options.y.tick.count !== undefined && typeof this.options.y.tick.count === 'number'
          ? this.options.y.tick.count
          : this.options.rotated === true
          ? Math.floor(graph_width / 90)
          : Math.floor(graph_height / 50)
      );
    }

    // y.tick.outer
    if (!this.options.y.tick.outer) {
      y_axis.tickSizeOuter(0);
    }

    y_axis_svg
      .attr('class', attr.class)
      .attr('transform', attr.transform)
      .call(y_axis);

    // y.show
    if (!this.options.y.show) {
      y_axis_svg.attr('display', 'none');
    }

    return { y_axis_svg, y_axis };
  }

  /**
   * Render Y Axis label
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param svg Parent SVG element's D3 object
   * @param y_axis D3 Y axis SVG element
   * @param graph_width Graph width
   * @param graph_height Graph height
   * @param label Y axis label object
   */
  renderYAxisLabel(
    svg: d3.Selection<SVGGElement, unknown, null, undefined>,
    y_axis: d3.Selection<SVGGElement, unknown, null, undefined>,
    graph_width: number,
    graph_height: number,
    label: AxisOptionsModel['y']['label']
  ): d3.Selection<SVGGElement, unknown, null, undefined> {
    const y_label: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append('text').text(label.text);
    if (this.options.rotated) {
      let text_anchor: 'start' | 'middle' | 'end';
      let label_x_position: number;
      let label_y_position: number;

      y_label.attr('class', 'ngx-d3--label ngx-d3--label--rotated ngx-d3--label--y');
      if (this.options.y.label.position.split('-')[0] === 'outer') {
        label_y_position = graph_height + 27;
      } else {
        label_y_position = graph_height - 5;
      }

      if (this.options.y.label.position.split('-')[1] === 'left') {
        text_anchor = 'start';
        label_x_position = 5;
      } else if (this.options.y.label.position.split('-')[1] === 'center') {
        text_anchor = 'middle';
        label_x_position = graph_width / 2;
      } else {
        text_anchor = 'end';
        label_x_position = graph_width;
      }

      y_label
        .attr('text-anchor', text_anchor)
        .attr('x', label_x_position)
        .attr('y', label_y_position);
    } else {
      let label_x_position: number;
      let label_dx: number;
      let label_dy: number;

      y_label.attr('class', 'ngx-d3--label ngx-d3--label--y').attr('transform', 'rotate(-90)');
      if (this.options.y.label.position.split('-')[0] === 'outer') {
        if (this.options.y.inner) {
          label_dy = -5;
        } else {
          label_dy = -y_axis.node().getBBox().width;
        }
      } else {
        if (this.options.y.inner) {
          label_dy = y_axis.node().getBBox().width + y_label.node().getBBox().height;
        } else {
          label_dy = y_label.node().getBBox().height;
        }
      }

      if (this.options.y.label.position.split('-')[1] === 'bottom') {
        label_x_position = -graph_height;
        label_dx = 5;
      } else if (this.options.y.label.position.split('-')[1] === 'middle') {
        label_x_position = -graph_height / 2;
        label_dx = -y_label.node().getBBox().width / 2;
      } else {
        label_x_position = 0;
        label_dx = -y_label.node().getBBox().width;
      }

      y_label
        .attr('x', label_x_position)
        .attr('dx', label_dx)
        .attr('dy', label_dy);
    }
    return y_label;
  }
}

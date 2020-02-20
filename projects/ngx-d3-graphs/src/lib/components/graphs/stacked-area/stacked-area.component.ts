import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnChanges,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import * as d3 from 'd3';
import moment from 'moment';
import { ResizeSensor } from 'css-element-queries';
import palette from 'google-palette';
import objectAssignDeep from 'object-assign-deep';

import { RegionComponents } from './../../../classes/region-components/region-components';
import { GraphOptions } from '../../../classes/graph-options/graph-options';
import { StackedAreaDataModel, StackedAreaOptionsModel } from '../../../data-models/stacked-area/stacked-area.model';
import { GraphOptionsModel } from '../../../data-models/graph-options/graph-options.model';
import { AxisComponents } from '../../../classes/axis-components/axis-components';
import { DEFAULT_STACKED_AREA_OPTIONS } from './../../../constants/default-stacked-area-options';
import { GridComponents } from '../../../classes/grid-components/grid-components';
import { LegendComponents } from '../../../classes/legend-components/legend-components';
import { TooltipComponents } from '../../../classes/tooltip-components/tooltip-components';

@Component({
  selector: 'ngx-d3-stacked-area',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StackedAreaComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('chart', { static: true })
  private _chartContainer: ElementRef;

  @Input() data: StackedAreaDataModel[];
  @Input() options: GraphOptionsModel;
  @Input() stacked_area_options: StackedAreaOptionsModel;

  @Output() areaclick: EventEmitter<string> = new EventEmitter();
  @Output() areacontextmenu: EventEmitter<string> = new EventEmitter();
  @Output() areadblclick: EventEmitter<string> = new EventEmitter();
  @Output() areamousedown: EventEmitter<string> = new EventEmitter();
  @Output() areamouseenter: EventEmitter<string> = new EventEmitter();
  @Output() areamouseleave: EventEmitter<string> = new EventEmitter();
  @Output() areamousemove: EventEmitter<string> = new EventEmitter();
  @Output() areamouseout: EventEmitter<string> = new EventEmitter();
  @Output() areamouseover: EventEmitter<string> = new EventEmitter();
  @Output() areamouseup: EventEmitter<string> = new EventEmitter();

  options_obj: GraphOptions;

  private _chart_element: d3.Selection<HTMLElement, unknown, null, undefined>;
  private _idle_timeout: NodeJS.Timer;
  private _svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _optimized_data: { [key: string]: Date | string | number }[] = [];
  private _keys: string[] = [];
  private _colors: string[] = [];
  private _stacked_data: d3.Series<{ [key: string]: number }, string>[];
  private _x:
    | d3.ScaleTime<number, number>
    | d3.ScaleLinear<number, number>
    | d3.ScalePoint<string>
    | d3.AxisScale<d3.AxisDomain>;
  private _x_axis_svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _x_axis: d3.Axis<d3.AxisDomain>;
  private _x_label: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _y: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
  private _y_axis_svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _y_axis: d3.Axis<d3.AxisDomain>;
  private _y_label: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _plot_area: d3.Area<[number, number]>;
  private _plot_line: d3.Line<[number, number]>;
  private _area_chart: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _brush: d3.BrushBehavior<unknown>;
  private _points: d3.Selection<
    SVGCircleElement,
    d3.SeriesPoint<{ [key: string]: number }>,
    SVGGElement,
    d3.Series<{ [key: string]: number }, string>
  >;
  private _legend:
    | d3.Selection<SVGGElement, unknown, null, undefined>
    | d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private _pointer_line_container: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _pointer_line: d3.Selection<SVGLineElement, unknown, null, undefined>;
  private _underlays: {
    parent: d3.Selection<SVGGElement, unknown, null, undefined>;
    event_underlay?: d3.Selection<SVGRectElement, unknown, null, undefined>;
  };
  private _tooltip_container: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private _tooltip: d3.Selection<HTMLTableElement, unknown, null, undefined>;
  private _tooltip_body: d3.Selection<HTMLTableSectionElement, unknown, null, undefined>;
  private _tooltip_title: d3.Selection<HTMLTableSectionElement, unknown, null, undefined>;

  constructor() {}

  ngOnInit() {
    console.log('ngOnInit()');
    this._initOps();
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit()');
    // tslint:disable-next-line: no-unused-expression
    new ResizeSensor(this._chartContainer.nativeElement, () => {
      this.onResize();
    });

    if (this.data !== undefined && this.data.length > 0) {
      this._createChart(this.data, this._chartContainer.nativeElement);
    } else {
      return;
    }
  }

  ngOnChanges() {
    console.log('ngOnChanges()');
    this._initOps();

    if (this.data !== undefined && this.data.length > 0 && this._chartContainer.nativeElement.offsetWidth !== 0) {
      this._createChart(this.data, this._chartContainer.nativeElement);
    } else {
      return;
    }
  }

  onResize(): void {
    console.log('onResize(): void');
    this._initOps();

    if (this.data !== undefined && this.data.length > 0) {
      this._createChart(this.data, this._chartContainer.nativeElement);
    } else {
      return;
    }
  }

  private _initOps(): void {
    console.log(' StackedAreaComponent.data', this.data);
    console.log(' StackedAreaComponent.options', this.options);
    console.log(' StackedAreaComponent.stacked_area_options', this.stacked_area_options);
    this.options_obj = new GraphOptions(this.options);
    console.log(' StackedAreaComponent.options_obj', this.options_obj);

    const temp_stacked_area_options: StackedAreaOptionsModel = objectAssignDeep({}, DEFAULT_STACKED_AREA_OPTIONS);
    objectAssignDeep(temp_stacked_area_options, this.stacked_area_options);

    this.stacked_area_options = temp_stacked_area_options;
  }

  private _createChart(data: StackedAreaDataModel[], element: HTMLElement): void {
    console.log('private _createChart(data: StackedAreaDataModel[], element: HTMLElement)', data, element);

    const graph_height = this.options_obj.size.height - this.options_obj.padding.top - this.options_obj.padding.bottom;
    const graph_width = element.offsetWidth - this.options_obj.padding.left - this.options_obj.padding.right;

    /**
     * Create base SVG
     */
    this._chart_element = d3.select(element);

    this._chart_element.select('svg').remove();

    this._svg = this._chart_element
      .append('svg')
      .attr('class', 'ngx-d3')
      .attr('width', element.offsetWidth)
      .attr('height', graph_height + this.options_obj.padding.top + this.options_obj.padding.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.options_obj.padding.left + ',' + this.options_obj.padding.top + ')');

    /**
     * Process data
     */
    this._processData(data);

    /**
     * Axes
     */
    const axes: AxisComponents = new AxisComponents(this.options_obj.axis);

    // Add X axis
    this._createXAxis(axes, graph_width, graph_height);

    // Add X axis label
    if (this.options_obj.axis.x.label) {
      this._creatXAxisLabel(axes, graph_width, graph_height);
    }

    // Add Y Axis
    this._createYAxis(axes, graph_width, graph_height);

    // Add Y Axis label
    if (this.options_obj.axis.y.label) {
      this._creatYAxisLabel(axes, graph_width, graph_height);
    }

    /**
     * Brushing and chart plotting
     */

    // Add underlays
    this._addUnderlays(graph_width, graph_height);

    // Plot the areas
    this._plotStackedArea(graph_width, graph_height);

    // Animate graph
    if (this.options_obj.transition.duration) {
      this._animateStackedArea();
    }

    // Area mouse events
    if (this.options_obj.interaction.enabled) {
      this._attachMouseEventsToAreas();
    }

    /**
     * Grids and lines
     */
    if (
      this.options_obj.grid.x.show ||
      (this.options_obj.grid.x.lines && this.options_obj.grid.x.lines.length > 0) ||
      this.options_obj.grid.y.show ||
      (this.options_obj.grid.y.lines && this.options_obj.grid.x.lines.length > 0)
    ) {
      const grid: GridComponents = new GridComponents(this.options_obj.grid);

      // Show X axis grids
      if (this.options_obj.grid.x.show) {
        this._displayXAxisGrids(grid, graph_width, graph_height);
      }

      // Show X axis lines
      if (this.options_obj.grid.x.lines && this.options_obj.grid.x.lines.length > 0) {
        this._displayXAxisLines(grid, graph_width, graph_height);
      }

      // Show Y axis grids
      if (this.options_obj.grid.y.show) {
        this._displayYAxisGrids(grid, graph_width, graph_height);
      }

      // Show Y axis lines
      if (this.options_obj.grid.y.lines && this.options_obj.grid.x.lines.length > 0) {
        this._displayYAxisLines(grid, graph_width, graph_height);
      }
    }

    /**
     * Regions
     */
    if (this.options_obj.regions && this.options_obj.regions.length > 0) {
      const regions: RegionComponents = new RegionComponents(this.options.regions);

      // Render regions
      regions.renderRegions(
        this._svg,
        this._x,
        this._y,
        graph_width,
        graph_height,
        this.options_obj.axis.rotated,
        this.options_obj.axis.x.type,
        this.options_obj.axis.y.type
      );
    }

    /**
     * Legends
     */
    if (this.options_obj.legend.show) {
      const legends: LegendComponents = new LegendComponents(this.options.legend);

      // Render legends
      this._legend = legends.renderOrdinalLegend(
        this._chart_element,
        this._svg,
        this.options_obj.padding,
        graph_width,
        graph_height,
        this._keys,
        this._colors
      );
    }

    /**
     * Pointer Line
     */
    if (this.options_obj.pointer_line && this.options_obj.pointer_line.show) {
      this._preparePointerLine(graph_width, graph_height);
    }

    /**
     * Tooltip
     */
    if (this.options_obj.tooltip && this.options_obj.tooltip.show) {
      // Create tooltip container
      this._chart_element.select('.ngx-d3--tooltip--container').remove();

      this._tooltip_container = this._chart_element.append('div').attr('class', 'ngx-d3--tooltip--container');
    }

    // Set event handlers
    this._setChartEleMouseOverEventHandler();
    this._setChartEleMouseOutEventHandler();
    this._setChartEleMouseMoveEventHandler(graph_width, graph_height);
  }

  /**
   * Process data to get stacked data
   *
   */
  private _processData: (data: StackedAreaDataModel[]) => void = (data: StackedAreaDataModel[]): void => {
    this._optimized_data = [];

    const sumstat = d3
      .nest()
      .key((d: any) => d.plot.x)
      .entries(data);

    sumstat.forEach(ss => {
      let obj: { [key: string]: Date | string | number };
      if (this.options_obj.axis.x.type === 'timeseries') {
        obj = {
          key: moment(ss.key).toDate()
        };
      } else if (this.options_obj.axis.x.type === 'category') {
        obj = {
          key: ss.key
        };
      } else {
        if (!isNaN(+ss.key)) {
          obj = {
            key: +ss.key
          };
        } else {
          console.error('data[i].key', ss.key, typeof ss.key);
          throw new Error(
            `StackedAreaComponent.options.axis.x.type = '${
              this.options_obj.axis.x.type
            }', and typeof data[i].key = '${typeof ss.key}' are not compatible.`
          );
        }
      }

      ss.values.forEach((value: StackedAreaDataModel) => {
        obj[value.key] = value.plot.y;

        if (!this._keys.includes(value.key)) {
          this._keys.push(value.key);
        }
      });
      this._optimized_data.push(obj);
    });

    this._keys.forEach(key => {
      for (const row of this._optimized_data) {
        if (row[key] === undefined) {
          row[key] = 0;
        }
      }
    });

    if (this.options_obj.color.pattern && this.options_obj.color.pattern.length >= this._keys.length) {
      this._colors = this.options_obj.color.pattern.slice(0, this._keys.length);
    } else {
      this._colors = palette('mpn65', this._keys.length);
    }

    console.log('this._optimized_data', this._optimized_data);
    console.log('this._keys', this._keys);
    console.log('this._colors', this._colors);

    this._stacked_data = d3.stack().keys(this._keys)(this._optimized_data as { [key: string]: number }[]);

    console.log('this._stacked_data', this._stacked_data);
  };

  /**
   * Create and render X Axis
   *
   */
  private _createXAxis: (axes: AxisComponents, graph_width: number, graph_height: number) => void = (
    axes: AxisComponents,
    graph_width: number,
    graph_height: number
  ): void => {
    if (this.options_obj.axis.x.type === 'timeseries') {
      this._x = axes.getXAxis(
        d3.extent(this._optimized_data, d => d.key as Date),
        graph_width,
        graph_height
      );
    } else if (this.options_obj.axis.x.type === 'category') {
      let categories: string[] = this.options_obj.axis.x.categories;
      const computed_categories: string[] = [];
      this._optimized_data.forEach(data_row => {
        computed_categories.push(data_row.key.toString());
      });
      if (categories === undefined || categories.length !== computed_categories.length) {
        categories = computed_categories;
      } else {
        categories = categories.map(a => {
          return a.toString();
        });
      }
      this._x = axes.getXAxis(categories, graph_width, graph_height);
    } else {
      this._x = axes.getXAxis(
        d3.extent(this._optimized_data, d => d.key as number),
        graph_width,
        graph_height
      );
    }

    const x_axis_values = axes.renderXAxis(this._svg, this._x, graph_width, graph_height, this.options_obj.padding);
    this._x_axis_svg = x_axis_values.x_axis_svg;
    this._x_axis = x_axis_values.x_axis;
  };

  /**
   * Create and render X Axis Label
   *
   */
  private _creatXAxisLabel: (axes: AxisComponents, graph_width: number, graph_height: number) => void = (
    axes: AxisComponents,
    graph_width: number,
    graph_height: number
  ): void => {
    this._x_label = axes.renderXAxisLabel(
      this._svg,
      this._x_axis_svg,
      graph_width,
      graph_height,
      this.options_obj.axis.x.label
    );
  };

  /**
   * Create Y axis D3 object
   *
   */
  private _createYAxis: (axes: AxisComponents, graph_width: number, graph_height: number) => void = (
    axes: AxisComponents,
    graph_width: number,
    graph_height: number
  ): void => {
    if (this.options_obj.axis.y.type === 'timeseries') {
      this._y = axes.getLinearYAxis(this._getYDomain('Date'), graph_width, graph_height);
    } else if (this.options_obj.axis.y.type === 'linear') {
      this._y = axes.getLinearYAxis(this._getYDomain('number'), graph_width, graph_height);
    }

    const y_axis_values = axes.renderYAxis(this._svg, this._y, graph_width, graph_height);
    this._y_axis_svg = y_axis_values.y_axis_svg;
    this._y_axis = y_axis_values.y_axis;
  };

  /**
   * Get data-wise domain of Y axis data
   *
   * @author Sushant Kumar<sushant.kum96@gmail.com>
   * @param type type of data `number` or `Date`
   */
  private _getYDomain(type: 'number' | 'Date'): [number, number] | [Date, Date] {
    switch (type) {
      case 'number':
        let min_num: number;
        let max_num: number;

        for (const stack_entry of this._stacked_data) {
          for (const entry of stack_entry) {
            if (min_num === undefined || entry[0] < min_num) {
              min_num = entry[0];
            }
            if (max_num === undefined || entry[1] > max_num) {
              max_num = entry[1];
            }
          }
        }

        return [min_num, max_num];

      case 'Date':
        let min_date: moment.Moment;
        let max_date: moment.Moment;

        for (const stack_entry of this._stacked_data) {
          for (const entry of stack_entry) {
            if (min_date === undefined || moment(entry[0]).isBefore(min_date)) {
              min_date = moment(entry[0]);
            }
            if (max_date === undefined || moment(entry[1]).isAfter(max_date)) {
              max_date = moment(entry[1]);
            }
          }
        }

        return [min_date.toDate(), max_date.toDate()];
    }
  }

  /**
   * Create Y Axis label
   *
   */
  private _creatYAxisLabel: (axes: AxisComponents, graph_width: number, graph_height: number) => void = (
    axes: AxisComponents,
    graph_width: number,
    graph_height: number
  ): void => {
    this._y_label = axes.renderYAxisLabel(
      this._svg,
      this._y_axis_svg,
      graph_width,
      graph_height,
      this.options_obj.axis.y.label
    );
  };

  /**
   * Add underlays
   *
   * @memberof StackedAreaComponent
   */
  private _addUnderlays: (graph_width: number, graph_height: number) => void = (
    graph_width: number,
    graph_height: number
  ): void => {
    this._underlays = {
      parent: this._svg.append('g').attr('class', 'ngx-d3--underlays')
    };

    // Add event underlay
    if (this.options_obj.interaction && this.options_obj.interaction.enabled) {
      this._underlays.event_underlay = this._underlays.parent
        .append('rect')
        .attr('class', 'ngx-d3--underlay ngx-d3--underlay--events')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', graph_width)
        .attr('height', graph_height);
    }
  };

  /**
   * Plot stacked areas
   *
   */
  private _plotStackedArea: (graph_width: number, graph_height: number) => void = (
    graph_width: number,
    graph_height: number
  ): void => {
    this._svg
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'id-ngx-d3--clip')
      .append('svg:rect')
      .attr('width', graph_width)
      .attr('height', graph_height)
      .attr('x', 0)
      .attr('y', 0);

    // Create the scatter variable: where both the circles and the brush take place
    this._area_chart = this._svg.append('g').attr('clip-path', 'url(#id-ngx-d3--clip)');

    // Area generator
    this._plot_area = this.options_obj.axis.rotated
      ? d3
          .area()
          .x0(d => {
            return this._y(this.options_obj.transition.duration ? 0 : d[0]);
          })
          .x1(d => {
            return this._y(this.options_obj.transition.duration ? 0 : d[1]);
          })
          .y((d: any) => {
            return this._x(d.data.key);
          })
      : d3
          .area()
          .x((d: any) => {
            return this._x(d.data.key);
          })
          .y0(d => {
            return this._y(this.options_obj.transition.duration ? 0 : d[0]);
          })
          .y1(d => {
            return this._y(this.options_obj.transition.duration ? 0 : d[1]);
          });

    // Show the areas
    this._area_chart
      .selectAll('ngx-d3--layers')
      .data(this._stacked_data)
      .enter()
      .append('path')
      .attr('class', d => 'ngx-d3--plot--area ngx-d3--plot--area--key--' + d.key.toLowerCase().replace(/\s/g, ''))
      .attr('data-key', d => d.key)
      .style('stroke', this.stacked_area_options.area.stroke.color_hex)
      .attr('stroke-width', this.stacked_area_options.area.stroke.width)
      .style('fill', d => this._colors[this._keys.indexOf(d.key)])
      .attr('fill-opacity', this.stacked_area_options.area.opacity.unhovered)
      .attr('d', this._plot_area as any);

    // Line generator
    this._plot_line = this.options_obj.axis.rotated
      ? d3
          .line()
          .x(d => {
            return this._y(this.options_obj.transition.duration ? 0 : d[1]);
          })
          .y((d: any) => {
            return this._x(d.data.key);
          })
      : d3
          .line()
          .x((d: any) => {
            return this._x(d.data.key);
          })
          .y(d => {
            return this._y(this.options_obj.transition.duration ? 0 : d[1]);
          });

    // Show the lines
    this._area_chart
      .selectAll('ngx-d3--lines')
      .data(this._stacked_data)
      .enter()
      .append('path')
      .attr('class', d => 'ngx-d3--plot--line ngx-d3--plot--line--key--' + d.key.toLowerCase().replace(/\s/g, ''))
      .attr('data-key', d => d.key)
      .style('stroke', d =>
        this.stacked_area_options.area.stroke.color_hex
          ? this.stacked_area_options.area.stroke.color_hex
          : this._colors[this._keys.indexOf(d.key)]
      )
      .attr('stroke-width', this.stacked_area_options.area.stroke.width)
      .style('fill', 'none')
      .attr('d', this._plot_line as any);

    // Show the points
    // if (this.options_obj.point && this.options_obj.point.show) {
    setTimeout(
      () => {
        this._points = this._area_chart
          .selectAll('ngx-d3--plot--points')
          .data(this._stacked_data)
          .enter()
          .append('g')
          .attr(
            'class',
            stack =>
              'ngx-d3--plot--points ngx-d3--plot--points--key--' +
              stack.key.toLowerCase().replace(/\s/g, '') +
              (this.options_obj.point && this.options_obj.point.show ? '' : ' ngx-d3--plot--points--invisible')
          )
          .attr('data-key', stack => stack.key)
          .style('fill', stack =>
            this.stacked_area_options.area.stroke.color_hex
              ? this.stacked_area_options.area.stroke.color_hex
              : this._colors[this._keys.indexOf(stack.key)]
          )
          .selectAll('ngx-d3--plot--point')
          .data(stack => {
            return stack;
          })
          .enter()
          .append('circle')
          .attr('class', entry => {
            return (
              'ngx-d3--plot--point ngx-d3--plot--point--key--' +
              entry.data.key
                .toString()
                .toLowerCase()
                .replace(/\s/g, '') +
              (this.options_obj.point && this.options_obj.point.show ? '' : ' ngx-d3--plot--point--invisible')
            );
          })
          .attr('data-plot-x', entry => entry.data.key)
          .attr('data-plot-y', entry => entry[1])
          .attr('cx', entry => {
            return this.options_obj.axis.rotated ? this._y(entry[1]) : this._x(entry.data.key as any);
          })
          .attr('cy', entry => {
            return this.options_obj.axis.rotated ? this._x(entry.data.key as any) : this._y(entry[1]);
          })
          .attr('r', this.options_obj.point.r);

        if (
          this.options_obj.point.focus &&
          this.options_obj.point.focus.expand &&
          this.options_obj.point.focus.expand.enabled
        ) {
          for (const point of this._svg.selectAll('.ngx-d3--plot--point').nodes()) {
            const d3_point = d3.select(point);

            d3_point.on('mouseover', () => {
              this._plotPointMouseOverEventHandler(d3_point);
            });
            d3_point.on('mouseout', () => {
              this._plotPointMouseOutEventHandler(d3_point);
            });
          }
        }
      },
      this.options_obj.transition.duration ? this.options_obj.transition.duration : 0
    );
    // }
  };

  /**
   * Animate graph
   *
   */
  private _animateStackedArea: () => void = (): void => {
    // Area generator
    this._plot_area = this.options_obj.axis.rotated
      ? d3
          .area()
          .x0(d => {
            return this._y(d[0]);
          })
          .x1(d => {
            return this._y(d[1]);
          })
          .y((d: any) => {
            return this._x(d.data.key);
          })
      : d3
          .area()
          .x((d: any) => {
            return this._x(d.data.key);
          })
          .y0(d => {
            return this._y(d[0]);
          })
          .y1(d => {
            return this._y(d[1]);
          });

    // Animate area
    this._svg
      .selectAll('.ngx-d3--plot--area')
      .transition()
      .duration(this.options_obj.transition.duration)
      .attr('d', this._plot_area as any);

    // Line generator
    this._plot_line = this.options_obj.axis.rotated
      ? d3
          .line()
          .x(d => {
            return this._y(d[1]);
          })
          .y((d: any) => {
            return this._x(d.data.key);
          })
      : d3
          .line()
          .x((d: any) => {
            return this._x(d.data.key);
          })
          .y(d => {
            return this._y(d[1]);
          });

    // Animate line
    this._svg
      .selectAll('.ngx-d3--plot--line')
      .transition()
      .duration(this.options_obj.transition.duration)
      .attr('d', this._plot_line as any);
  };

  /**
   * Attach mouse events to areas
   *
   */
  private _attachMouseEventsToAreas: () => void = (): void => {
    const ided_keys = this._keys.map(key => key.toLowerCase().replace(/\s/g, ''));

    const areas = this._svg.selectAll('.ngx-d3--plot--area');

    for (const area of areas.nodes()) {
      const d3_area = d3.select(area);
      let ided_key: string;
      for (const ele_class of d3_area.attr('class').split(' ')) {
        if (ele_class.indexOf('ngx-d3--plot--area--key--') === 0) {
          ided_key = ele_class.split('ngx-d3--plot--area--key--')[1];
          break;
        }
      }
      const key = ided_keys.includes(ided_key) ? this._keys[ided_keys.indexOf(ided_key)] : undefined;

      d3_area.on('click', () => {
        this.areaclick.emit(key);
      });
      d3_area.on('contextmenu', () => {
        this.areacontextmenu.emit(key);
      });
      d3_area.on('dblclick', () => {
        this.areadblclick.emit(key);
      });
      d3_area.on('mousedown', () => {
        this.areamousedown.emit(key);
      });
      d3_area.on('mouseenter', () => {
        d3_area.attr('fill-opacity', this.stacked_area_options.area.opacity.hovered);
        this.areamouseenter.emit(key);
      });
      d3_area.on('mouseleave', () => {
        d3_area.attr('fill-opacity', this.stacked_area_options.area.opacity.unhovered);
        this.areamouseleave.emit(key);
      });
      d3_area.on('mousemove', () => {
        this.areamousemove.emit(key);
      });
      d3_area.on('mouseout', () => {
        this.areamouseout.emit(key);
      });
      d3_area.on('mouseover', () => {
        this.areamouseover.emit(key);
      });
      d3_area.on('mouseup', () => {
        this.areamouseup.emit(key);
      });
    }
  };

  /**
   * Display X axis grids
   *
   * @memberof StackedAreaComponent
   */
  private _displayXAxisGrids: (grid: GridComponents, graph_width: number, graph_height: number) => void = (
    grid: GridComponents,
    graph_width: number,
    graph_height: number
  ): void => {
    grid.renderXAxisGrids(
      this._svg,
      this._x,
      graph_width,
      graph_height,
      this.options_obj.axis.rotated,
      this.options_obj.axis.x.type,
      this.options_obj.axis.x.tick.values,
      this.options_obj.axis.x.tick.count
    );
  };

  /**
   * Display X axis lines and line-labels
   *
   */
  private _displayXAxisLines: (grid: GridComponents, graph_width: number, graph_height: number) => void = (
    grid: GridComponents,
    graph_width: number,
    graph_height: number
  ): void => {
    grid.renderXAxisLines(
      this._svg,
      this._x,
      graph_width,
      graph_height,
      this.options_obj.axis.rotated,
      this.options_obj.axis.x.type
    );

    grid.renderXAxisLineLabels(
      this._svg,
      this._x,
      graph_width,
      graph_height,
      this.options_obj.axis.rotated,
      this.options_obj.axis.x.type
    );
  };

  /**
   * Display Y axis grids
   *
   */
  private _displayYAxisGrids: (grid: GridComponents, graph_width: number, graph_height: number) => void = (
    grid: GridComponents,
    graph_width: number,
    graph_height: number
  ): void => {
    grid.renderYAxisGrids(
      this._svg,
      this._y,
      graph_width,
      graph_height,
      this.options_obj.axis.rotated,
      this.options_obj.axis.y.tick.values,
      this.options_obj.axis.y.tick.count
    );
  };

  /**
   * Display Y axis lines and line-labels
   *
   */
  private _displayYAxisLines: (grid: GridComponents, graph_width: number, graph_height: number) => void = (
    grid: GridComponents,
    graph_width: number,
    graph_height: number
  ): void => {
    grid.renderYAxisLines(
      this._svg,
      this._y,
      graph_width,
      graph_height,
      this.options_obj.axis.rotated,
      this.options_obj.axis.y.type
    );

    grid.renderYAxisLineLabels(
      this._svg,
      this._y,
      graph_width,
      graph_height,
      this.options_obj.axis.rotated,
      this.options_obj.axis.y.type
    );
  };

  /**
   * Prepare pointer line
   *
   * @memberof StackedAreaComponent
   */
  private _preparePointerLine: (graph_width: number, graph_height: number) => void = (
    graph_width: number,
    graph_height: number
  ): void => {
    this._pointer_line_container = this._svg
      .append('g')
      .lower()
      .attr('class', 'ngx-d3--pointer-line--container');

    if (this.options_obj.axis.rotated) {
      this._pointer_line = this._pointer_line_container
        .append('line')
        .attr('class', 'ngx-d3--pointer-line ngx-d3--pointer-line--x ngx-d3--pointer-line--rotated')
        .attr('x1', 0)
        .attr('x2', graph_width);
    } else {
      this._pointer_line = this._pointer_line_container
        .append('line')
        .attr('class', 'ngx-d3--pointer-line ngx-d3--pointer-line--x')
        .attr('y1', 0)
        .attr('y2', -graph_height);
    }
  };

  /**
   * Display pointer line
   *
   */
  private _displayPointerLine: (graph_width: number, graph_height: number) => void = (
    graph_width: number,
    graph_height: number
  ): void => {
    if (this.options_obj.axis.rotated) {
      if (this.options_obj.axis.x.type === 'category') {
        const y_pos = this._x.range()[0] - this._x.range()[this._x.range().length - 1] - d3.mouse(this._svg.node())[1];
        const x0 =
          ((this._x.domain().length - 1) * y_pos) / (this._x.range()[0] - this._x.range()[this._x.range().length - 1]);
        const i = Math.ceil(x0);
        const d0 = this._x.domain()[i - 1];
        const d1 = this._x.domain()[i];
        let d:
          | string
          | {
              valueOf(): number;
            };
        if (this.options_obj.pointer_line.step && this.options_obj.pointer_line.step.type === 'step-before') {
          d = d0;
        } else if (this.options_obj.pointer_line.step && this.options_obj.pointer_line.step.type === 'step-after') {
          d = d1;
        } else {
          d = x0 - Math.floor(x0) >= Math.ceil(x0) - x0 ? d1 : d0;
        }
        this._pointer_line.attr('transform', `translate(0, ${this._x(d as any)})`);
      } else {
        const y_pos = d3.mouse(this._svg.node())[1];
        const x_axis_arr_as_number = this._optimized_data.map(ele => {
          return ele.key as number;
        });
        const x0 = (this._x as any).invert(y_pos);
        const i = d3.bisectLeft(x_axis_arr_as_number, x0);
        const d0 = x_axis_arr_as_number[i - 1];
        const d1 = x_axis_arr_as_number[i];
        let d:
          | string
          | {
              valueOf(): number;
            };
        if (this.options_obj.pointer_line.step && this.options_obj.pointer_line.step.type === 'step-before') {
          d = d0;
        } else if (this.options_obj.pointer_line.step && this.options_obj.pointer_line.step.type === 'step-after') {
          d = d1;
        } else {
          d = x0 - d0 > d1 - x0 ? d1 : d0;
        }
        this._pointer_line.attr('transform', `translate(0, ${this._x(d as any)})`);
      }
    } else {
      const x_pos = d3.mouse(this._svg.node())[0];

      if (this.options_obj.axis.x.type === 'category') {
        const x0 =
          ((this._x.domain().length - 1) * x_pos) / (this._x.range()[this._x.range().length - 1] - this._x.range()[0]);
        const i = Math.ceil(x0);
        const d0 = this._x.domain()[i - 1];
        const d1 = this._x.domain()[i];
        let d:
          | string
          | {
              valueOf(): number;
            };
        if (this.options_obj.pointer_line.step && this.options_obj.pointer_line.step.type === 'step-before') {
          d = d0;
        } else if (this.options_obj.pointer_line.step && this.options_obj.pointer_line.step.type === 'step-after') {
          d = d1;
        } else {
          d = x0 - Math.floor(x0) >= Math.ceil(x0) - x0 ? d1 : d0;
        }
        this._pointer_line.attr('transform', `translate(${this._x(d as any)}, ${graph_height})`);
      } else {
        const x_axis_arr_as_number = this._optimized_data.map(ele => {
          return ele.key as number;
        });
        const x0 = (this._x as any).invert(x_pos);
        const i = d3.bisectLeft(x_axis_arr_as_number, x0);
        const d0 = x_axis_arr_as_number[i - 1];
        const d1 = x_axis_arr_as_number[i];
        let d:
          | string
          | {
              valueOf(): number;
            };
        if (this.options_obj.pointer_line.step && this.options_obj.pointer_line.step.type === 'step-before') {
          d = d0;
        } else if (this.options_obj.pointer_line.step && this.options_obj.pointer_line.step.type === 'step-after') {
          d = d1;
        } else {
          d = x0 - d0 > d1 - x0 ? d1 : d0;
        }
        this._pointer_line.attr('transform', `translate(${this._x(d as any)}, ${graph_height})`);
      }
    }
  };

  /**
   * Display grouped tooltip
   *
   */
  private _displayGroupedTooltip: () => void = (): void => {
    const tooltip: TooltipComponents = new TooltipComponents(this.options.tooltip);

    if (this.options_obj.axis.rotated) {
      const x_pos = d3.mouse(this._svg.node())[0];
      const y_pos = d3.mouse(this._svg.node())[1];

      let d:
        | string
        | {
            valueOf(): number;
          };

      if (this.options_obj.axis.x.type === 'category') {
        const y_pos_modified = this._x.range()[0] - this._x.range()[this._x.range().length - 1] - y_pos;
        const x0 =
          ((this._x.domain().length - 1) * y_pos_modified) /
          (this._x.range()[0] - this._x.range()[this._x.range().length - 1]);
        const i = Math.ceil(x0);
        const d0 = this._x.domain()[i - 1];
        const d1 = this._x.domain()[i];

        if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-before'
        ) {
          d = d0;
        } else if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-after'
        ) {
          d = d1;
        } else {
          d = x0 - Math.floor(x0) >= Math.ceil(x0) - x0 ? d1 : d0;
        }
      } else {
        const x_axis_arr_as_number = this._optimized_data.map(ele => {
          return ele.key as number;
        });
        const x0 = (this._x as any).invert(y_pos);
        const i = d3.bisectLeft(x_axis_arr_as_number, x0);
        const d0 = x_axis_arr_as_number[i - 1];
        const d1 = x_axis_arr_as_number[i];
        if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-before'
        ) {
          d = d0;
        } else if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-after'
        ) {
          d = d1;
        } else {
          d = x0 - d0 > d1 - x0 ? d1 : d0;
        }
      }

      const data: { key: string; value: string; color: string }[] = [];
      for (const optimized_data_row of this._optimized_data) {
        if (optimized_data_row.key === d) {
          for (const key of this._keys) {
            data.push({
              key: this.options_obj.tooltip.format.key ? this.options_obj.tooltip.format.key(key) : key,
              value: this.options_obj.tooltip.format.value
                ? this.options_obj.tooltip.format.value(
                    optimized_data_row[key] ? (optimized_data_row[key] as number | Date) : 0
                  )
                : optimized_data_row[key]
                ? String(optimized_data_row[key])
                : '',
              color: this._colors[this._keys.indexOf(key)]
            });
          }
          break;
        }
      }
      const title = this.options_obj.tooltip.format.title ? this.options_obj.tooltip.format.title(d as any) : String(d);

      if (d !== undefined) {
        this._tooltip_container.style('display', null);
        if (!(this._tooltip_title && this._tooltip_title.select('.ngx-d3--tooltip--title').text() === title)) {
          const tooltip_eles = tooltip.createTooltip(this._tooltip_container, title, data);
          this._tooltip = tooltip_eles.tooltip;
          this._tooltip_title = tooltip_eles.tooltip_title;
          this._tooltip_body = tooltip_eles.tooltip_body;
        }
      } else {
        this._tooltip_container.style('display', 'none');
      }

      const top: number =
        this._x(d as any) + this.options_obj.padding.top + this.options_obj.tooltip.position.top <
        this._svg.node().getBBox().height - this._tooltip_container.node().offsetHeight
          ? this._x(d as any) + this.options_obj.padding.top + this.options_obj.tooltip.position.top
          : this._svg.node().getBBox().height - this._tooltip_container.node().offsetHeight;
      const left: number = x_pos + this.options_obj.padding.left + this.options_obj.tooltip.position.left;

      this._tooltip_container.style(
        'top',
        `${top >= this.options_obj.padding.top ? top : this.options_obj.padding.top}px`
      );
      this._tooltip_container.style(
        'left',
        `${
          left <
          this._chart_element.node().offsetWidth -
            this.options_obj.padding.right -
            this._tooltip_container.node().offsetWidth -
            this.options_obj.tooltip.position.left
            ? left
            : this._chart_element.node().offsetWidth -
              this.options_obj.padding.right -
              this._tooltip_container.node().offsetWidth -
              this.options_obj.tooltip.position.left
        }px`
      );
    } else {
      const x_pos = d3.mouse(this._svg.node())[0];
      const y_pos = d3.mouse(this._svg.node())[1];

      let d:
        | string
        | {
            valueOf(): number;
          };

      if (this.options_obj.axis.x.type === 'category') {
        const x0 =
          ((this._x.domain().length - 1) * x_pos) / (this._x.range()[this._x.range().length - 1] - this._x.range()[0]);
        const i = Math.ceil(x0);
        const d0 = this._x.domain()[i - 1];
        const d1 = this._x.domain()[i];

        if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-before'
        ) {
          d = d0;
        } else if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-after'
        ) {
          d = d1;
        } else {
          d = x0 - Math.floor(x0) >= Math.ceil(x0) - x0 ? d1 : d0;
        }
      } else {
        const x_axis_arr_as_number = this._optimized_data.map(ele => {
          return ele.key as number;
        });
        const x0 = (this._x as any).invert(x_pos);
        const i = d3.bisectLeft(x_axis_arr_as_number, x0);
        const d0 = x_axis_arr_as_number[i - 1];
        const d1 = x_axis_arr_as_number[i];

        if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-before'
        ) {
          d = d0;
        } else if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-after'
        ) {
          d = d1;
        } else {
          d = x0 - d0 > d1 - x0 ? d1 : d0;
        }
      }

      const data: { key: string; value: string; color: string }[] = [];
      for (const optimized_data_row of this._optimized_data) {
        if (optimized_data_row.key === d) {
          for (const key of this._keys) {
            data.push({
              key: this.options_obj.tooltip.format.key ? this.options_obj.tooltip.format.key(key) : key,
              value: this.options_obj.tooltip.format.value
                ? this.options_obj.tooltip.format.value(
                    optimized_data_row[key] ? (optimized_data_row[key] as number | Date) : 0
                  )
                : optimized_data_row[key]
                ? String(optimized_data_row[key])
                : '',
              color: this._colors[this._keys.indexOf(key)]
            });
          }
          break;
        }
      }
      const title = this.options_obj.tooltip.format.title ? this.options_obj.tooltip.format.title(d as any) : String(d);

      if (d !== undefined) {
        this._tooltip_container.style('display', null);
        if (!(this._tooltip_title && this._tooltip_title.select('.ngx-d3--tooltip--title').text() === title)) {
          const tooltip_eles = tooltip.createTooltip(this._tooltip_container, title, data);
          this._tooltip = tooltip_eles.tooltip;
          this._tooltip_title = tooltip_eles.tooltip_title;
          this._tooltip_body = tooltip_eles.tooltip_body;
        }
      } else {
        this._tooltip_container.style('display', 'none');
      }

      const top: number =
        y_pos + this.options_obj.padding.top + this.options_obj.tooltip.position.top <
        this._svg.node().getBBox().height - this._tooltip_container.node().offsetHeight
          ? y_pos + this.options_obj.padding.top + this.options_obj.tooltip.position.top
          : this._svg.node().getBBox().height - this._tooltip_container.node().offsetHeight;
      const left: number = this._x(d as any) + this.options_obj.padding.left + this.options_obj.tooltip.position.left;

      this._tooltip_container.style(
        'top',
        `${top >= this.options_obj.padding.top ? top : this.options_obj.padding.top}px`
      );
      this._tooltip_container.style(
        'left',
        `${
          left <
          this._chart_element.node().offsetWidth -
            this.options_obj.padding.right -
            this._tooltip_container.node().offsetWidth -
            this.options_obj.tooltip.position.left
            ? left
            : this._chart_element.node().offsetWidth -
              this.options_obj.padding.right -
              this._tooltip_container.node().offsetWidth -
              this.options_obj.tooltip.position.left
        }px`
      );
    }
  };

  /**
   * Display non-grouped tooltip
   */
  private _displayNonGroupedTooltip: (d3_point: d3.Selection<d3.BaseType, unknown, null, undefined>) => void = (
    d3_point: d3.Selection<d3.BaseType, unknown, null, undefined>
  ): void => {
    const tooltip: TooltipComponents = new TooltipComponents(this.options.tooltip);
    const parent_node: HTMLElement = (d3_point.node() as any).parentNode as HTMLElement;
    const key: string = parent_node.getAttribute('data-key');

    if (this.options_obj.axis.rotated) {
      const x_pos = d3.mouse(this._svg.node())[0];
      const y_pos = d3.mouse(this._svg.node())[1];

      let x:
        | string
        | {
            valueOf(): number;
          };
      const y: number | Date = isNaN(d3_point.attr('data-plot-y') as any)
        ? moment(d3_point.attr('data-plot-y')).toDate()
        : +d3_point.attr('data-plot-y') || 0;

      if (this.options_obj.axis.x.type === 'category') {
        const y_pos_modified = this._x.range()[0] - this._x.range()[this._x.range().length - 1] - y_pos;
        const x0 =
          ((this._x.domain().length - 1) * y_pos_modified) /
          (this._x.range()[0] - this._x.range()[this._x.range().length - 1]);
        const i = Math.ceil(x0);
        const d0 = this._x.domain()[i - 1];
        const d1 = this._x.domain()[i];

        if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-before'
        ) {
          x = d0;
        } else if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-after'
        ) {
          x = d1;
        } else {
          x = x0 - Math.floor(x0) >= Math.ceil(x0) - x0 ? d1 : d0;
        }
      } else {
        const x_axis_arr_as_number = this._optimized_data.map(ele => {
          return ele.key as number;
        });
        const x0 = (this._x as any).invert(y_pos);
        const i = d3.bisectLeft(x_axis_arr_as_number, x0);
        const d0 = x_axis_arr_as_number[i - 1];
        const d1 = x_axis_arr_as_number[i];
        if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-before'
        ) {
          x = d0;
        } else if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-after'
        ) {
          x = d1;
        } else {
          x = x0 - d0 > d1 - x0 ? d1 : d0;
        }
      }

      const data: { key: string; value: string; color: string }[] = [
        {
          key,
          value: this.options_obj.tooltip.format.value ? this.options_obj.tooltip.format.value(y) : y.toString(),
          color: this._colors[this._keys.indexOf(key)]
        }
      ];
      const title = this.options_obj.tooltip.format.title ? this.options_obj.tooltip.format.title(x as any) : String(x);
      console.log('title', title, 'data', data);

      if (x !== undefined) {
        this._tooltip_container.style('display', null);
        if (!(this._tooltip_title && this._tooltip_title.select('.ngx-d3--tooltip--title').text() === title)) {
          const tooltip_eles = tooltip.createTooltip(this._tooltip_container, title, data);
          this._tooltip = tooltip_eles.tooltip;
          this._tooltip_title = tooltip_eles.tooltip_title;
          this._tooltip_body = tooltip_eles.tooltip_body;
        }
      } else {
        this._tooltip_container.style('display', 'none');
      }

      const top: number =
        this._x(x as any) + this.options_obj.padding.top + this.options_obj.tooltip.position.top <
        this._svg.node().getBBox().height - this._tooltip_container.node().offsetHeight
          ? this._x(x as any) + this.options_obj.padding.top + this.options_obj.tooltip.position.top
          : this._svg.node().getBBox().height - this._tooltip_container.node().offsetHeight;
      const left: number = x_pos + this.options_obj.padding.left + this.options_obj.tooltip.position.left;

      this._tooltip_container.style(
        'top',
        `${top >= this.options_obj.padding.top ? top : this.options_obj.padding.top}px`
      );
      this._tooltip_container.style(
        'left',
        `${
          left <
          this._chart_element.node().offsetWidth -
            this.options_obj.padding.right -
            this._tooltip_container.node().offsetWidth -
            this.options_obj.tooltip.position.left
            ? left
            : this._chart_element.node().offsetWidth -
              this.options_obj.padding.right -
              this._tooltip_container.node().offsetWidth -
              this.options_obj.tooltip.position.left
        }px`
      );
    } else {
      const x_pos = d3.mouse(this._svg.node())[0];
      const y_pos = d3.mouse(this._svg.node())[1];

      let x:
        | string
        | {
            valueOf(): number;
          };
      const y: number | Date = isNaN(d3_point.attr('data-plot-y') as any)
        ? moment(d3_point.attr('data-plot-y')).toDate()
        : +d3_point.attr('data-plot-y') || 0;

      if (this.options_obj.axis.x.type === 'category') {
        const x0 =
          ((this._x.domain().length - 1) * x_pos) / (this._x.range()[this._x.range().length - 1] - this._x.range()[0]);
        const i = Math.ceil(x0);
        const d0 = this._x.domain()[i - 1];
        const d1 = this._x.domain()[i];

        if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-before'
        ) {
          x = d0;
        } else if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-after'
        ) {
          x = d1;
        } else {
          x = x0 - Math.floor(x0) >= Math.ceil(x0) - x0 ? d1 : d0;
        }
      } else {
        const x_axis_arr_as_number = this._optimized_data.map(ele => {
          return ele.key as number;
        });
        const x0 = (this._x as any).invert(x_pos);
        const i = d3.bisectLeft(x_axis_arr_as_number, x0);
        const d0 = x_axis_arr_as_number[i - 1];
        const d1 = x_axis_arr_as_number[i];

        if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-before'
        ) {
          x = d0;
        } else if (
          this.options_obj.pointer_line &&
          this.options_obj.pointer_line.step &&
          this.options_obj.pointer_line.step.type === 'step-after'
        ) {
          x = d1;
        } else {
          x = x0 - d0 > d1 - x0 ? d1 : d0;
        }
      }

      const data: { key: string; value: string; color: string }[] = [
        {
          key,
          value: this.options_obj.tooltip.format.value ? this.options_obj.tooltip.format.value(y) : y.toString(),
          color: this._colors[this._keys.indexOf(key)]
        }
      ];
      const title = this.options_obj.tooltip.format.title ? this.options_obj.tooltip.format.title(x as any) : String(x);

      console.log('title', title, 'data', JSON.stringify(data));

      if (x !== undefined) {
        this._tooltip_container.style('display', null);
        const tooltip_eles = tooltip.createTooltip(this._tooltip_container, title, data);
        this._tooltip = tooltip_eles.tooltip;
        this._tooltip_title = tooltip_eles.tooltip_title;
        this._tooltip_body = tooltip_eles.tooltip_body;
      } else {
        this._tooltip_container.style('display', 'none');
      }

      const top: number =
        y_pos + this.options_obj.padding.top + this.options_obj.tooltip.position.top <
        this._svg.node().getBBox().height - this._tooltip_container.node().offsetHeight
          ? y_pos + this.options_obj.padding.top + this.options_obj.tooltip.position.top
          : this._svg.node().getBBox().height - this._tooltip_container.node().offsetHeight;
      const left: number = this._x(x as any) + this.options_obj.padding.left + this.options_obj.tooltip.position.left;

      this._tooltip_container.style(
        'top',
        `${top >= this.options_obj.padding.top ? top : this.options_obj.padding.top}px`
      );
      this._tooltip_container.style(
        'left',
        `${
          left <
          this._chart_element.node().offsetWidth -
            this.options_obj.padding.right -
            this._tooltip_container.node().offsetWidth -
            this.options_obj.tooltip.position.left
            ? left
            : this._chart_element.node().offsetWidth -
              this.options_obj.padding.right -
              this._tooltip_container.node().offsetWidth -
              this.options_obj.tooltip.position.left
        }px`
      );
    }
  };

  /**
   * Set chart-element mouse-over event handler
   *
   */
  private _setChartEleMouseOverEventHandler: () => void = (): void => {
    this._chart_element.on('mouseover', () => {
      // Make pointer-line container visible
      if (this.options_obj.pointer_line && this.options_obj.pointer_line.show && this._pointer_line_container) {
        this._pointer_line_container.style('display', 'unset');
      }

      // Make tooltip container visible
      if (
        this.options_obj.tooltip &&
        this.options_obj.tooltip.show &&
        this.options_obj.tooltip.grouped &&
        this._tooltip_container
      ) {
        this._tooltip_container.style('display', null);
      }
    });
  };

  /**
   * Set chart-element mouse-out event handler
   *
   */
  private _setChartEleMouseOutEventHandler: () => void = (): void => {
    this._chart_element.on('mouseout', () => {
      // Make pointer-line container invisible
      if (this.options_obj.pointer_line && this.options_obj.pointer_line.show && this._pointer_line_container) {
        this._pointer_line_container.style('display', null);
      }

      // Make tooltip container invisible
      if (
        this.options_obj.tooltip &&
        this.options_obj.tooltip.show &&
        this.options_obj.tooltip.grouped &&
        this._tooltip_container
      ) {
        this._tooltip_container.style('display', 'none');
      }
    });
  };

  /**
   * Set chart-element mouse-move event handler
   *
   */
  private _setChartEleMouseMoveEventHandler: (graph_width: number, graph_height: number) => void = (
    graph_width: number,
    graph_height: number
  ): void => {
    this._chart_element.on('mousemove', () => {
      // Dsiplay pointer-line
      if (this.options_obj.pointer_line && this.options_obj.pointer_line.show) {
        this._displayPointerLine(graph_width, graph_height);
      }

      // Display tooltip
      if (this.options_obj.tooltip && this.options_obj.tooltip.show && this.options_obj.tooltip.grouped) {
        this._displayGroupedTooltip();
      }
    });
  };

  /**
   * Set point mouse-over event handler
   *
   */
  private _plotPointMouseOverEventHandler: (d3_point: d3.Selection<d3.BaseType, unknown, null, undefined>) => void = (
    d3_point: d3.Selection<d3.BaseType, unknown, null, undefined>
  ): void => {
    // Expand point
    d3_point
      .attr('r', this.options_obj.point.focus.expand.r)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', '1px');
    (d3_point.node() as HTMLElement).classList.add('ngx-d3--plot--point--mouseover');
    (d3_point.node() as HTMLElement).classList.add('ngx-d3--plot--point--expanded');

    // Show non-grouped tooltip
    if (this.options_obj.tooltip && this.options_obj.tooltip.show && !this.options_obj.tooltip.grouped) {
      this._tooltip_container.style('display', null);
      this._displayNonGroupedTooltip(d3_point);
    }
  };

  /**
   * Set point mouse-out event handler
   *
   */
  private _plotPointMouseOutEventHandler: (d3_point: d3.Selection<d3.BaseType, unknown, null, undefined>) => void = (
    d3_point: d3.Selection<d3.BaseType, unknown, null, undefined>
  ): void => {
    // De-expand point
    d3_point
      .attr('r', this.options_obj.point.r)
      .attr('stroke', undefined)
      .attr('stroke-width', undefined);
    (d3_point.node() as HTMLElement).classList.remove('ngx-d3--plot--point--mouseover');
    (d3_point.node() as HTMLElement).classList.remove('ngx-d3--plot--point--expanded');

    // Hide non-grouped tooltip
    if (
      this.options_obj.tooltip &&
      this.options_obj.tooltip.show &&
      !this.options_obj.tooltip.grouped &&
      this._tooltip_container
    ) {
      this._tooltip_container.style('display', 'none');
    }
  };
}

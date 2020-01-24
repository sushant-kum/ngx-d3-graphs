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

import { GraphOptions } from '../../../classes/graph-options/graph-options';
import { StackedAreaDataModel, StackedAreaOptionsModel } from '../../../data-models/stacked-area/stacked-area.model';
import { GraphOptionsModel } from '../../../data-models/graph-options/graph-options.model';
import { AxisComponents } from '../../../classes/axis-components/axis-components';
import { DEFAULT_STACKED_AREA_OPTIONS } from './../../../constants/default-stacked-area-options';
import { GridComponents } from '../../../classes/grid-components/grid-components';

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
  private _y_axis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _y_label: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _area: d3.Area<[number, number]>;
  private _line: d3.Line<[number, number]>;
  private _area_chart: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _brush: d3.BrushBehavior<unknown>;

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
    d3.select(element)
      .select('svg')
      .remove();

    this._svg = d3
      .select(element)
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
     * Grid lines
     */
    const grid: GridComponents = new GridComponents(this.options.grid);

    // Show X axis grids
    if (this.options.grid.x.show) {
      this._displayXAxisGrids(grid, graph_width, graph_height);
    }

    // Show X axis lines
    if (this.options.grid.x.lines && this.options.grid.x.lines.length > 0) {
      this._displayXAxisLines(grid, graph_width, graph_height);
    }
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

    this._y_axis = axes.renderYAxis(this._svg, this._y, graph_width, graph_height);
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
      this._y_axis,
      graph_width,
      graph_height,
      this.options_obj.axis.y.label
    );
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
    this._area = this.options_obj.axis.rotated
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
      .attr('class', d => 'ngx-d3--area ngx-d3--area--key--' + d.key.toLowerCase().replace(/\s/g, ''))
      .style('stroke', this.stacked_area_options.area.stroke.color_hex)
      .attr('stroke-width', this.stacked_area_options.area.stroke.width)
      .style('fill', d => this._colors[this._keys.indexOf(d.key)])
      .attr('fill-opacity', this.stacked_area_options.area.opacity.unhovered)
      .attr('d', this._area as any);

    // Line generator
    this._line = this.options_obj.axis.rotated
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
      .selectAll('ngx-d3-lines')
      .data(this._stacked_data)
      .enter()
      .append('path')
      .attr('class', d => 'ngx-d3--line ngx-d3--line--key--' + d.key.toLowerCase().replace(/\s/g, ''))
      .style('stroke', d =>
        this.stacked_area_options.area.stroke.color_hex
          ? this.stacked_area_options.area.stroke.color_hex
          : this._colors[this._keys.indexOf(d.key)]
      )
      .attr('stroke-width', this.stacked_area_options.area.stroke.width)
      .style('fill', 'none')
      .attr('d', this._line as any);
  };

  /**
   * Animate graph
   *
   */
  private _animateStackedArea: () => void = (): void => {
    // Area generator
    this._area = this.options_obj.axis.rotated
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
      .selectAll('.ngx-d3--area')
      .transition()
      .duration(this.options_obj.transition.duration)
      .attr('d', this._area as any);

    // Line generator
    this._line = this.options_obj.axis.rotated
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
      .selectAll('.ngx-d3--line')
      .transition()
      .duration(this.options_obj.transition.duration)
      .attr('d', this._line as any);
  };

  /**
   * Attach mouse events to areas
   *
   */
  private _attachMouseEventsToAreas: () => void = (): void => {
    const ided_keys = this._keys.map(key => key.toLowerCase().replace(/\s/g, ''));

    const areas = this._svg.selectAll('.ngx-d3--area');

    for (const area of areas.nodes()) {
      const d3_area = d3.select(area);
      let ided_key: string;
      for (const ele_class of d3_area.attr('class').split(' ')) {
        if (ele_class.indexOf('ngx-d3--area--key--') === 0) {
          ided_key = ele_class.split('ngx-d3--area--key--')[1];
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
  };
}

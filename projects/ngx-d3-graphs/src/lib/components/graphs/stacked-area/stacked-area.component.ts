import { Component, OnInit, Input, AfterViewInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import moment from 'moment';
import { ResizeSensor } from 'css-element-queries';
import * as uniqueColors from 'unique-colors';

import { GraphOptions } from '../../../classes/graph-options/graph-options';
import { StackedAreaDataModel } from '../../../data-models/stacked-area-data/stacked-area-data.model';
import { GraphOptionsModel } from '../../../data-models/graph-options/graph-options.model';
import { AxisComponents } from '../../../classes/axis-components/axis-components';

@Component({
  selector: 'ngx-d3-stacked-area',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss']
})
export class StackedAreaComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('chart', { static: true })
  private _chartContainer: ElementRef;

  @Input() data: StackedAreaDataModel[];
  @Input() options: GraphOptions;

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
  private _x_axis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _y: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.AxisScale<d3.AxisDomain>;
  private _y_axis: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _area: d3.Area<[number, number]>;
  private _area_chart: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _brush: d3.BrushBehavior<unknown>;

  constructor() {}

  ngOnInit() {
    console.log('ngOnInit()');
    console.log('StackedAreaComponent.data', this.data);
    console.log('StackedAreaComponent.options', this.options);
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
    console.log(' StackedAreaComponent.data', this.data);
    console.log(' StackedAreaComponent.options', this.options);

    if (this.data !== undefined && this.data.length > 0 && this._chartContainer.nativeElement.offsetWidth !== 0) {
      this._createChart(this.data, this._chartContainer.nativeElement);
    } else {
      return;
    }
  }

  onResize(): void {
    console.log('onResize(): void');
    console.log(' StackedAreaComponent.data', this.data);
    console.log(' StackedAreaComponent.options', this.options);
    if (this.data !== undefined && this.data.length > 0) {
      this._createChart(this.data, this._chartContainer.nativeElement);
    } else {
      return;
    }
  }

  private _createChart(data: StackedAreaDataModel[], element: HTMLElement): void {
    console.log('private _createChart(data: StackedAreaDataModel[], element: HTMLElement)', data, element);

    const graph_height = this.options.size.height - this.options.padding.top - this.options.padding.bottom;
    const graph_width = element.offsetWidth - this.options.padding.left - this.options.padding.right;

    /**
     * Create base SVG
     */
    d3.select(element)
      .select('svg')
      .remove();

    this._svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', graph_height + this.options.padding.top + this.options.padding.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.options.padding.left + ',' + this.options.padding.top + ')');

    /**
     * Process data
     */
    const sumstat = d3
      .nest()
      .key((d: any) => d.plot.x)
      .entries(data);

    sumstat.forEach(ss => {
      let obj: { [key: string]: Date | string | number };
      if (this.options.axis.x.type === 'timeseries') {
        obj = {
          key: d3.timeParse('%Y-%m-%d')(ss.key)
        };
      } else if (this.options.axis.x.type === 'category') {
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
              this.options.axis.x.type
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

    if (this.options.color.pattern && this.options.color.pattern.length >= this._keys.length) {
      this._colors = this.options.color.pattern.slice(0, this._keys.length);
    } else {
      this._colors = uniqueColors.unique_colors(this._keys.length);
    }

    console.log('this._optimized_data', this._optimized_data);
    console.log('this._keys', this._keys);
    console.log('this._colors', this._colors);

    this._stacked_data = d3.stack().keys(this._keys)(this._optimized_data as { [key: string]: number }[]);

    console.log('this._stacked_data', this._stacked_data);

    /**
     * Axes
     */
    const axes: AxisComponents = new AxisComponents(this.options.axis);

    // Add X axis
    if (this.options.axis.x.type === 'timeseries') {
      this._x = axes.getXAxis(
        d3.extent(this._optimized_data, d => d.key as Date),
        graph_width,
        graph_height
      );
    } else if (this.options.axis.x.type === 'category') {
      let categories: string[] = this.options.axis.x.categories;
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

    this._x_axis = axes.renderXAxis(this._svg, this._x, graph_width, graph_height);
      // .append('g')
      // .attr('class', 'ngx-d3--axis ngx-d3--axis--x')
      // .attr('transform', 'translate(0,' + graph_height + ')')
      // .call(
      //   d3
      //     .axisLeft(this._x as any)
      //     .ticks(
      //       this.options.axis.x.tick.count !== undefined && typeof this.options.axis.x.tick.count === 'number'
      //         ? this.options.axis.x.tick.count
      //         : Math.floor(graph_width / 90)
      //     )
      // );
  }
}

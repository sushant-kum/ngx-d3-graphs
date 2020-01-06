import { Component, OnInit, Input, AfterViewInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import moment from 'moment';
import { ResizeSensor } from 'css-element-queries';

import { GraphOptions } from '../../../classes/graph-options/graph-options';
import { StackedAreaDataModel } from '../../../data-models/stacked-area-data/stacked-area-data.model';
import { GraphOptionsModel } from '../../../data-models/graph-options/graph-options.model';

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

  private _data: StackedAreaDataModel[];
  private _options: GraphOptions;

  constructor() {}

  ngOnInit() {
    console.log('ngOnInit()');
    console.log('StackedAreaComponent.data', this.data);
    console.log('StackedAreaComponent.options', this.options);
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit()');
    // tslint:disable-next-line: no-unused-expression
    new ResizeSensor(this._chartContainer.nativeElement, () => {
      this.onResize();
    });

    if (this._data !== undefined && this._data.length > 0) {
      this._createChart(this._data, this._chartContainer.nativeElement, this._options.padding);
    } else {
      return;
    }
  }

  ngOnChanges() {
    console.log('ngOnChanges()');
    console.log(' StackedAreaComponent.data', this.data);
    console.log(' StackedAreaComponent.options', this.options);
    this._data = this.data;
    this._options = this.options;

    if (this._data !== undefined && this._data.length > 0 && this._chartContainer.nativeElement.offsetWidth !== 0) {
      this._createChart(this._data, this._chartContainer.nativeElement, this._options.padding);
    } else {
      return;
    }
  }

  onResize(): void {
    console.log('onResize(): void');
    if (this._data !== undefined && this._data.length > 0) {
      this._createChart(this._data, this._chartContainer.nativeElement, this._options.padding);
    } else {
      return;
    }
  }

  private _createChart(
    data: StackedAreaDataModel[],
    element: HTMLElement,
    padding: GraphOptionsModel['padding']
  ): void {
    console.log(
      "private _createChart(data: StackedAreaDataModel[], element: HTMLElement, padding: GraphOptionsModel['padding'])",
      data,
      element,
      padding
    );
  }
}

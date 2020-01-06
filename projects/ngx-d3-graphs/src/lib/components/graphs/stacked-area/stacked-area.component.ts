import { Component, OnInit, Input } from '@angular/core';

import { GraphOptions } from '../../../classes/graph-options/graph-options';

@Component({
  selector: 'ngx-d3-stacked-area',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss']
})
export class StackedAreaComponent implements OnInit {
  @Input() data;
  @Input() options: GraphOptions;

  constructor() {}

  ngOnInit() {
    console.log('StackedAreaComponent.data', this.data);
    console.log('StackedAreaComponent.options', this.options);
  }
}

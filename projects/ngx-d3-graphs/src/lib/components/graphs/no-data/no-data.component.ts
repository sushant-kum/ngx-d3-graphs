import { Component, OnInit, Input } from '@angular/core';

import { DEFAULT_GRAPH_OPTIONS } from '../../../constants/default-graph-options';
import { GraphOptionsModel } from '../../../data-models/graph-options/graph-options.model';

@Component({
  selector: 'ngx-d3-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {
  @Input() width: GraphOptionsModel['size']['width'] = DEFAULT_GRAPH_OPTIONS.size.width;
  @Input() height: GraphOptionsModel['size']['height'] = DEFAULT_GRAPH_OPTIONS.size.height;
  @Input() no_data_text: GraphOptionsModel['no_data_text'] = DEFAULT_GRAPH_OPTIONS.no_data_text;
  constructor() {}

  ngOnInit() {}
}

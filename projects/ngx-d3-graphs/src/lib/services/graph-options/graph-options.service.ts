import { Injectable } from '@angular/core';

import { GraphOptionsModel } from '../../data-models/graph-options/graph-options';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';

@Injectable({
  providedIn: 'root'
})
export class GraphOptionsService {
  constructor(graph_options?: GraphOptionsModel) {
    console.log(DEFAULT_GRAPH_OPTIONS);
  }
}

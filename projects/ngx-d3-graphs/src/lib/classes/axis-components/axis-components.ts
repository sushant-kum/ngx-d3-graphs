import objectAssignDeep from 'object-assign-deep';
import * as d3 from 'd3';

import { AxisOptionsModel } from '../../data-models/axis-options/axis-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';

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
}

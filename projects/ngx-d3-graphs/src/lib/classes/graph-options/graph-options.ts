import objectAssignDeep from 'object-assign-deep';

import { GraphOptionsModel } from '../../data-models/graph-options/graph-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';
import { AxisOptionsModel } from '../../data-models/axis-options/axis-options.model';
import { GridOptionsModel } from '../../data-models/grid-options/grid-options.model';
import { RegionOptionsModel } from '../../data-models/region-options/region-options.model';
import { LegendOptionsModel } from '../../data-models/legend-options/legend-options.model';
import { PointOptionsModel } from '../../data-models/point-options/point-options-model';
import { PointerLineOptionsModel } from '../../data-models/pointer-line-options/pointer-line-options.model';

export class GraphOptions {
  static readonly DEFAULT_GRAPH_OPTIONS = objectAssignDeep({}, DEFAULT_GRAPH_OPTIONS);

  no_data_text: GraphOptionsModel['no_data_text'];
  size: GraphOptionsModel['size'];
  padding: GraphOptionsModel['padding'];
  color: GraphOptionsModel['color'];
  interaction: GraphOptionsModel['interaction'];
  transition: GraphOptionsModel['transition'];
  axis: AxisOptionsModel;
  grid: GridOptionsModel;
  regions: RegionOptionsModel[];
  legend: LegendOptionsModel;
  point: PointOptionsModel;
  pointer_line: PointerLineOptionsModel;

  constructor(options?: GraphOptionsModel) {
    const temp_graph_options: GraphOptionsModel = objectAssignDeep({}, GraphOptions.DEFAULT_GRAPH_OPTIONS);
    console.log('temp_graph_options before', JSON.parse(JSON.stringify(temp_graph_options)));
    objectAssignDeep(temp_graph_options, options);
    console.log('temp_graph_options after', JSON.parse(JSON.stringify(temp_graph_options)));

    this.no_data_text = temp_graph_options.no_data_text;
    this.size = temp_graph_options.size;
    this.padding = temp_graph_options.padding;
    this.color = temp_graph_options.color;
    this.interaction = temp_graph_options.interaction;
    this.transition = temp_graph_options.transition;
    this.axis = temp_graph_options.axis;
    this.grid = temp_graph_options.grid;
    this.regions = temp_graph_options.regions;
    this.legend = temp_graph_options.legend;
    this.point = temp_graph_options.point;
    this.pointer_line = temp_graph_options.pointer_line;
  }
}

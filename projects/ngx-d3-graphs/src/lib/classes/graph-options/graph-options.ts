import { GraphOptionsModel } from '../../data-models/graph-options/graph-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';

export class GraphOptions {
  static readonly DEFAULT_GRAPH_OPTIONS = Object.assign({}, DEFAULT_GRAPH_OPTIONS);

  no_data_text: GraphOptionsModel['no_data_text'];
  size: GraphOptionsModel['size'];
  padding: GraphOptionsModel['padding'];
  color: GraphOptionsModel['color'];
  interaction: GraphOptionsModel['interaction'];
  transition: GraphOptionsModel['transition'];

  constructor(options?: GraphOptionsModel) {
    if (!options) {
      this.size = GraphOptions.DEFAULT_GRAPH_OPTIONS.size;
      this.padding = GraphOptions.DEFAULT_GRAPH_OPTIONS.padding;
      this.color = GraphOptions.DEFAULT_GRAPH_OPTIONS.color;
      this.interaction = GraphOptions.DEFAULT_GRAPH_OPTIONS.interaction;
      this.transition = GraphOptions.DEFAULT_GRAPH_OPTIONS.transition;
    } else {
      this._setChartOptions(options);
    }
  }

  /**
   * Set options of chart
   *
   * @author Sushant Kumar
   * @memberof GraphOptions
   */
  private _setChartOptions(options?: GraphOptionsModel): void {
    // Set GraphOptions.options.no_data_text
    if (options.no_data_text === undefined) {
      this.no_data_text = GraphOptions.DEFAULT_GRAPH_OPTIONS.no_data_text;
    } else {
      this.no_data_text = options.no_data_text;
    }

    // Set GraphOptions.options.size
    if (options.size === undefined) {
      this.size = GraphOptions.DEFAULT_GRAPH_OPTIONS.size;
    } else {
      this.size = options.size;

      if (this.size.width === undefined) {
        this.size.width = GraphOptions.DEFAULT_GRAPH_OPTIONS.size.width;
      }
      if (this.size.height === undefined) {
        this.size.height = GraphOptions.DEFAULT_GRAPH_OPTIONS.size.height;
      }
    }

    // Set GraphOptions.options.padding
    if (options.padding === undefined) {
      this.padding = GraphOptions.DEFAULT_GRAPH_OPTIONS.padding;
    } else {
      this.padding = options.padding;

      if (this.padding.top === undefined) {
        this.padding.top = GraphOptions.DEFAULT_GRAPH_OPTIONS.padding.top;
      }
      if (this.padding.right === undefined) {
        this.padding.right = GraphOptions.DEFAULT_GRAPH_OPTIONS.padding.right;
      }
      if (this.padding.bottom === undefined) {
        this.padding.bottom = GraphOptions.DEFAULT_GRAPH_OPTIONS.padding.bottom;
      }
      if (this.padding.left === undefined) {
        this.padding.left = GraphOptions.DEFAULT_GRAPH_OPTIONS.padding.left;
      }
    }

    // Set GraphOptions.options.color
    if (options.color === undefined) {
      this.color = GraphOptions.DEFAULT_GRAPH_OPTIONS.color;
    } else {
      this.color = options.color;

      if (this.color.pattern === undefined) {
        this.color.pattern = GraphOptions.DEFAULT_GRAPH_OPTIONS.color.pattern;
      }
    }

    // Set GraphOptions.options.interaction
    if (options.interaction === undefined) {
      this.interaction = GraphOptions.DEFAULT_GRAPH_OPTIONS.interaction;
    } else {
      this.interaction = options.interaction;

      if (this.interaction.enabled === undefined) {
        this.interaction.enabled = GraphOptions.DEFAULT_GRAPH_OPTIONS.interaction.enabled;
      }
    }

    // Set GraphOptions.options.transition
    if (options.transition === undefined) {
      this.transition = GraphOptions.DEFAULT_GRAPH_OPTIONS.transition;
    } else {
      this.transition = options.transition;

      if (this.transition.duration === undefined) {
        this.transition.duration = GraphOptions.DEFAULT_GRAPH_OPTIONS.transition.duration;
      }
    }
  }
}

import * as d3 from 'd3';
import assignDeep from 'assign-deep';

import { TooltipOptionsModel } from '../../data-models/tooltip-options/tooltip-options.model';
import { DEFAULT_GRAPH_OPTIONS } from '../../constants/default-graph-options';

export class TooltipComponents {
  static readonly DEFAULT_TOOLTIP_OPTIONS: TooltipOptionsModel = assignDeep({}, DEFAULT_GRAPH_OPTIONS.tooltip);

  options: TooltipOptionsModel;

  constructor(tooltip_options?: TooltipOptionsModel) {
    const temp_tooltip_options: TooltipOptionsModel = assignDeep({}, TooltipComponents.DEFAULT_TOOLTIP_OPTIONS);
    console.log('temp_tooltip_options before', JSON.parse(JSON.stringify(temp_tooltip_options)));
    assignDeep(temp_tooltip_options, tooltip_options);
    console.log('temp_tooltip_options after', JSON.parse(JSON.stringify(temp_tooltip_options)));
    this.options = temp_tooltip_options;
  }

  createTooltip(
    tooltip_container: d3.Selection<HTMLDivElement, unknown, null, undefined>,
    title: string,
    data: { key: string; value: string; color: string }[]
  ): {
    tooltip: d3.Selection<HTMLTableElement, unknown, null, undefined>;
    tooltip_title: d3.Selection<HTMLTableSectionElement, unknown, null, undefined>;
    tooltip_body: d3.Selection<HTMLTableSectionElement, unknown, null, undefined>;
  } {
    tooltip_container.select('.ngx-d3--tooltip').remove();

    const tooltip: d3.Selection<HTMLTableElement, unknown, null, undefined> = tooltip_container
      .append('table')
      .attr('class', 'ngx-d3--tooltip');

    const tooltip_title: d3.Selection<HTMLTableSectionElement, unknown, null, undefined> = tooltip.append('thead');

    tooltip_title
      .append('tr')
      .append('th')
      .attr('class', 'ngx-d3--tooltip--title')
      .attr('colspan', 2)
      .text(title);

    const tooltip_body: d3.Selection<HTMLTableSectionElement, unknown, null, undefined> = tooltip
      .append('tbody')
      .attr('class', 'ngx-d3--tooltip--body');

    for (const row of data) {
      const tr = tooltip_body.append('tr').attr('class', 'ngx-d3--tooltip--row');

      const td_key = tr.append('td');
      td_key
        .append('div')
        .attr('class', 'ngx-d3--tooltip--color')
        .style('background-color', row.color);
      td_key
        .append('span')
        .attr('class', 'ngx-d3--tooltip--key')
        .text(row.key);

      tr.append('td')
        .append('span')
        .attr('class', 'ngx-d3--tooltip--value')
        .text(row.value);
    }

    return { tooltip, tooltip_title, tooltip_body };
  }
}

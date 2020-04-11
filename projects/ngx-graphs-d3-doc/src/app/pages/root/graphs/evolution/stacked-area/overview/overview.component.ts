import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CodeHighlighterService } from '@doc/src/app/services/code-highlighter/code-highlighter.service';

/* Import Data models */
import { TableOfContentEntry } from '@doc/src/app/data-models/table-of-content-entry/table-of-content-entry';
import { CodeSnippet } from '@doc/src/app/data-models/code-snippet/code-snippet';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit {
  @ViewChild('definition') definition: ElementRef;
  @ViewChild('usage') usage: ElementRef;
  @ViewChild('configurations') configurations: ElementRef;

  readonly table_of_content_entries: TableOfContentEntry[] = [
    {
      name: 'Definition',
      fragment: 'definition'
    },
    {
      name: 'Usage',
      fragment: 'usage'
    },
    {
      name: 'Configurations',
      fragment: 'configurations'
    },
    {
      name: 'Specific Configurations',
      fragment: 'specific_configurations',
      step: 2
    },
    {
      name: 'General Configurations',
      fragment: 'general_configurations',
      step: 2
    }
  ];
  readonly code_examples: { [key: string]: CodeSnippet } = {
    simple_usage: {
      html: {
        code: `<!--
@file simple-stacked-area.component.html
-->

<ngx-d3-stacked-area [data]="graph_data"></ngx-d3-stacked-area>
`,
        language: 'html'
      },
      ts: {
        code: `/**\n
 * @file simple-stacked-area.component.ts
 */

import { Component, OnInit } from '@angular/core';

import { GraphOptionsModel, StackedAreaDataModel } from 'ngx-graphs-d3';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  graph_data: StackedAreaDataModel[] = [
    {
      key: <key name>,          // Key of the area, each unique key will form an area
      plot: {                   // Single plot point
        x: <key plot's x plot>, // X coordinate of the plot point
        y: <key plot's y plot>  // Y coordinate of the plot point
      }
    }
  ];
}
`,
        language: 'typescript'
      }
    }
  };

  active_table_of_content_entry: TableOfContentEntry;
  fragment: string;

  constructor(
    private _route: ActivatedRoute,
    private _viewport_scroller: ViewportScroller,
    public code_highlighter: CodeHighlighterService
  ) {}

  ngOnInit(): void {
    this._route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  ngAfterViewInit(): void {
    for (const table_of_content_entry of this.table_of_content_entries) {
      table_of_content_entry.element_ref = this[table_of_content_entry.fragment];
    }

    if (this.fragment) {
      this._viewport_scroller.scrollToAnchor(this.fragment);
    }
  }
}

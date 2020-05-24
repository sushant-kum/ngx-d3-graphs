import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

/* Import Data models */
import { TableOfContentEntry } from '@doc/src/app/data-models/table-of-content-entry/table-of-content-entry';
import { CodeSnippet } from '@doc/src/app/data-models/code-snippet/code-snippet';

/* Import Services */
import { ScrollOffsetService } from '@doc/src/app/services/scroll-offset/scroll-offset.service';

@Component({
  selector: 'app-stacked-area-overview',
  templateUrl: './stacked-area-overview.component.html',
  styleUrls: ['./stacked-area-overview.component.scss']
})
export class StackedAreaOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild('definition') definition: ElementRef;
  @ViewChild('usage') usage: ElementRef;
  @ViewChild('configurations') configurations: ElementRef;
  @ViewChild('specific_configurations') specific_configurations: ElementRef;
  @ViewChild('general_configurations') general_configurations: ElementRef;

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
  readonly code_examples: { [key: string]: CodeSnippet[] } = {
    simple_usage: [
      {
        code: `<ngx-d3-stacked-area [data]="graph_data"></ngx-d3-stacked-area>
`,
        filename: 'app.component.html',
        language: 'html'
      },
      {
        code: `import { Component, OnInit } from '@angular/core';

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
        filename: 'app.component.ts',
        language: 'typescript'
      }
    ],
    stacked_area_options: [
      {
        code: `<ngx-d3-stacked-area
  [data]="graph_data"
  [options]="graph_options"
  [stacked_area_options]="stacked_area_options"
></ngx-d3-stacked-area>
`,
        filename: 'app.component.html',
        language: 'html'
      },
      {
        code: `import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { GraphOptionsModel, StackedAreaDataModel, StackedAreaOptionsModel } from 'ngx-graphs-d3';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  graph_data: StackedAreaDataModel[];
  graph_options: GraphOptionsModel = {
    size: {
      height: 400
    },
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50
    },
    axis: {
      x: {
        type: 'category'
      }
    }
  };
  stacked_area_options: StackedAreaOptionsModel = {
    area: {
      stroke: {
        color_hex: '#686868',
        width: 0.5
      },
      opacity: {
        unhovered: 0.5,
        hovered: 0.9
      }
    }
  }

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this._getGraphData();
  }

  private _getGraphData(): void {
    const url = '/assets/birth-records.json';

    this._http.get(url).subscribe(
      (res: any) => {
        this.graph_data = [];

        for (const data_row of res) {
          if (data_row.year >= 2000) {
            this.graph_data.push({
              key: data_row.name,
              plot: {
                x: data_row.year,
                y: data_row.n
              }
            });
          }
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    );
  }
}
`,
        filename: 'app.component.ts',
        language: 'typescript'
      }
    ]
  };

  active_table_of_content_entry: TableOfContentEntry;
  fragment: string;

  constructor(
    private _route: ActivatedRoute,
    private _viewport_scroller: ViewportScroller,
    private _scroll_offset_svc: ScrollOffsetService,
    private _change_detector_Ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._onPageScroll = this._onPageScroll.bind(this);

    this._route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  ngAfterViewInit(): void {
    for (const table_of_content_entry of this.table_of_content_entries) {
      table_of_content_entry.element_ref = this[table_of_content_entry.fragment];
      table_of_content_entry.element_offset = this._scroll_offset_svc.getOffset(
        table_of_content_entry.element_ref.nativeElement
      );
    }

    if (this.fragment) {
      this._viewport_scroller.scrollToAnchor(this.fragment);
    }

    document.addEventListener('scroll', this._onPageScroll);
  }

  private _onPageScroll(event: Event): void {
    const scroll_top: number = document.documentElement.scrollTop;
    const header_height: number = (document.getElementsByClassName('header')[0] as HTMLElement).offsetHeight;
    let flag_active_table_of_content_entry_set = false;

    for (let i = 0; i < this.table_of_content_entries.length; i++) {
      if (this.table_of_content_entries[i].element_offset) {
        if (i !== this.table_of_content_entries.length - 1) {
          if (
            this.table_of_content_entries[i].element_offset.top <= scroll_top + header_height &&
            scroll_top + header_height < this.table_of_content_entries[i + 1].element_offset.top
          ) {
            this.active_table_of_content_entry = this.table_of_content_entries[i];
            flag_active_table_of_content_entry_set = true;
            break;
          }
        } else {
          if (this.table_of_content_entries[i].element_offset.top <= scroll_top + header_height) {
            this.active_table_of_content_entry = this.table_of_content_entries[i];
            flag_active_table_of_content_entry_set = true;
            break;
          }
        }
      }
    }

    if (!flag_active_table_of_content_entry_set) {
      this.active_table_of_content_entry = undefined;
    }
  }

  onTableOfContentItemClicked(table_of_content_item: TableOfContentEntry): void {
    this._viewport_scroller.scrollToAnchor(table_of_content_item.fragment);
  }
}

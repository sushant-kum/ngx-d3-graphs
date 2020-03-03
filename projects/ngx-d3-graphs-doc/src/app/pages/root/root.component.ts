import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GraphOptionsModel, StackedAreaDataModel } from 'ngx-d3-graphs';

import { TitleService } from '@doc/src/app/serices/title/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
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
  constructor(private _title_svc: TitleService, private _http: HttpClient) {}

  ngOnInit(): void {
    this._title_svc.setTitle();

    this._getGraphData();
  }

  private _getGraphData(): void {
    const url = '/assets/mock-data/graphs/stacked-area/birth-records.json';

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

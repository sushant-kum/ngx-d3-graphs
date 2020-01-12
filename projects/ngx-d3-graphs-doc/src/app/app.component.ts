import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { GraphOptions, StackedAreaDataModel } from 'ngx-d3-graphs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  graph_options: GraphOptions = new GraphOptions({
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
      rotated: false,
      x: {
        type: 'indexed',
        tick: {
          format: x => {
            return x;
          },
          // values: [1880, 2000],
          rotate: 90
        }
      }
    }
  });

  graph_data: StackedAreaDataModel[];

  title = 'ngx-d3-graphs-doc';

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this._getGraphData();
  }

  private _getGraphData(): void {
    this.graph_data = [];
    this._http.get('assets/mock-data/graphs/stacked-area/birth-records.json').subscribe(
      (res: any) => {
        for (const data_row of res) {
          this.graph_data.push({
            key: data_row.name,
            plot: {
              x: data_row.year,
              y: data_row.n
            }
          });
        }
      },
      (err: HttpErrorResponse) => {
        console.error(err);
      }
    );
  }
}

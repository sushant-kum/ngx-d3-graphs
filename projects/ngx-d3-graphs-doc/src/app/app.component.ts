import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';

import { GraphOptionsModel, StackedAreaDataModel } from 'ngx-d3-graphs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  graph_options: GraphOptionsModel = {
    size: {
      height: 400
      // width: 500
    },
    padding: {
      top: 20,
      right: 20,
      bottom: 50,
      left: 50
    },
    axis: {
      // rotated: true,
      x: {
        // show: false,
        type: 'timeseries',
        localtime: false,
        tick: {
          format: x => {
            return moment(x).format('DD MMM, YYYY'); // + ' sajgf kjhsk haskjd h';
          }
          // outer: false
          // values: [1880, 2000],
          // rotate: 90
        },
        label: {
          text: 'Too long label text could be bad!'
          // position: 'inner-right'
        }
      }
    }
  };

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
              x: moment([data_row.year, 0, 1]).format('YYYY-MM-DD'),
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

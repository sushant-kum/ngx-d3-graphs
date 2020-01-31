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
        // min: 2000
        // show: false
        // type: 'timeseries'
        //   // localtime: false,
        // tick: {
        //   format: x => {
        //     console.log(typeof x);
        //     return moment(x).format('YYYY-MM-DD'); // + ' sajgf kjhsk haskjd h';
        //   }
        //   //     // outer: false
        //   //     // values: [1880, 2000],
        //   //     // rotate: 90
        // }
        //   // label: {
        //   //   text: 'Too long label text could be bad!'
        //   //   // position: 'inner-right'
        //   // }
      }
      //   y: {
      //     min: 10000,
      //     max: 100000,
      //     inner: true,
      //     label: {
      //       position: 'outer-top'
      //     }
      //   }
      // },
      // transition: {
      //   duration: 800
    },
    grid: {
      x: {
        show: true,
        lines: [
          // {
          //   value: 2005,
          //   text: '2005',
          //   position: 'end'
          // },
          {
            value: 1920,
            text: '1920'
          },
          {
            value: 2000,
            text: '2000'
          },
          {
            value: 2004,
            text: '2004'
          },
          {
            value: 2010,
            text: '2010'
          }
        ]
      },
      y: {
        show: true,
        lines: [
          // {
          //   value: 50000,
          //   text: '50000',
          //   position: 'start',
          //   class: 'red-font'
          // },
          {
            value: 50000,
            text: '50000'
          },
          {
            value: 80000,
            text: '80000'
          },
          {
            value: 140000,
            text: '140000'
          },
          {
            value: 150000,
            text: '150000'
          }
        ]
      }
    },
    regions: [
      { axis: 'x', end: 1920, class: 'regionX' },
      { axis: 'x', start: 2000, end: 2004, class: 'regionY' },
      { axis: 'x', start: 2010, class: 'regionX' },
      { axis: 'y', end: 50000, class: 'regionY' },
      { axis: 'y', start: 80000, end: 140000, class: 'regionY' },
      { axis: 'y', start: 150000, class: 'regionY' }
    ]
  };

  graph_data: StackedAreaDataModel[];

  title = 'ngx-d3-graphs-doc';

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this._getGraphData();
  }

  areaClick(key: string) {
    console.log('areaClick(key: string)', key);
  }

  private _getGraphData(): void {
    this.graph_data = [];
    this._http.get('assets/mock-data/graphs/stacked-area/birth-records.json').subscribe(
      (res: any) => {
        for (const data_row of res) {
          this.graph_data.push({
            key: data_row.name,
            plot: {
              x: data_row.year, // moment([data_row.year, 0, 1]).format('YYYY-MM-DD'),
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

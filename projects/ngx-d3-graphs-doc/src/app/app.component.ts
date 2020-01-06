import { Component } from '@angular/core';
import { GraphOptions } from 'ngx-d3-graphs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  graph_options: GraphOptions = new GraphOptions({
    size: {
      height: 400
    },
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  });
  title = 'ngx-d3-graphs-doc';
}

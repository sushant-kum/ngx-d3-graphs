import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-d3-stacked-area',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss']
})
export class StackedAreaComponent implements OnInit {
  @Input() data;

  constructor() {}

  ngOnInit() {}
}

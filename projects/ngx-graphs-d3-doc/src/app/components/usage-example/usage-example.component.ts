import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-usage-example',
  templateUrl: './usage-example.component.html',
  styleUrls: ['./usage-example.component.scss']
})
export class UsageExampleComponent implements OnInit {
  @Input() if_width_px: number;
  @Input() if_height_px: number;
  @Input() if_external_url: string;
  @Input() if_external_tooltip: string;
  @Input() if_src: string;
  @Input() if_title: string;

  constructor() {}

  ngOnInit(): void {
    if (this.if_height_px === undefined) {
      this.if_height_px = 500;
    }
  }
}

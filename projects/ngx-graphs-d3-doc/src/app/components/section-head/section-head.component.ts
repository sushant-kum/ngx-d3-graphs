import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-section-head',
  templateUrl: './section-head.component.html',
  styleUrls: ['./section-head.component.scss']
})
export class SectionHeadComponent implements OnInit {
  @Input() title: string;
  @Input() level: 1 | 2 | 3 | 4 | 5 | 6 = 3;
  @Input() routerLink: string[];
  @Input() fragment: string;

  constructor() {}

  ngOnInit(): void {}
}

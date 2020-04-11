import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-section-head',
  templateUrl: './section-head.component.html',
  styleUrls: ['./section-head.component.scss']
})
export class SectionHeadComponent implements OnInit {
  @Input() sh_title: string;
  @Input() sh_level: 1 | 2 | 3 | 4 | 5 | 6 = 3;
  @Input() sh_routerLink: string[];
  @Input() sh_fragment: string;

  constructor() {}

  ngOnInit(): void {}
}

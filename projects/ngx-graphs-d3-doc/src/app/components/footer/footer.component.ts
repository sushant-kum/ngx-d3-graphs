import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() app_title: string;
  @Input() lib_version: string;
  @Input() doc_version: string;

  copyright_years: {
    start: number;
    current: number;
  } = {
    start: 2020,
    current: new Date().getFullYear()
  };

  constructor() {}

  ngOnInit(): void {}
}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() app_title: string;
  @Input() lib_version: string;

  constructor() {}

  ngOnInit(): void {}
}
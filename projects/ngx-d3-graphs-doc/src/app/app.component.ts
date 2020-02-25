import { Component, OnInit } from '@angular/core';

/* Services */
import { TitleService } from 'projects/ngx-d3-graphs-doc/src/app/serices/title/title.service';

/* Configs */
import { CONFIG } from 'projects/ngx-d3-graphs-doc/src/app/config/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  version: {
    lib: string;
    doc: string;
  };

  constructor(private _title: TitleService) {}

  ngOnInit(): void {
    this._title.setTitle();

    this.version = {
      lib: CONFIG.lib_version,
      doc: CONFIG.doc_version
    };
  }
}

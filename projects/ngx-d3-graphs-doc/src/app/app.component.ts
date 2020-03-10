import { Component, OnInit } from '@angular/core';

/* Services */
import { TitleService } from '@doc/src/app/services/title/title.service';

/* Configs */
import { CONFIG } from '@doc/src/app/config/config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  app_title: string;
  version: {
    lib: string;
    doc: string;
  };

  constructor(private _title: TitleService) {}

  ngOnInit(): void {
    this._title.setTitle();

    this.app_title = CONFIG.app_title;
    this.version = {
      lib: CONFIG.lib_version,
      doc: CONFIG.doc_version
    };
  }
}

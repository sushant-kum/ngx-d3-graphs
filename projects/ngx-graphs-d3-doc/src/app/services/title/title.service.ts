import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CONFIG } from '@doc/src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private _app_title;

  constructor(private _title: Title) {
    this._app_title = CONFIG.app_title;
  }

  /**
   * Set browser tab title
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @param {string} [page]
   */
  setTitle(page?: string) {
    if (page) {
      this._title.setTitle(`${page} | ${this._app_title}`);
    } else {
      this._title.setTitle(this._app_title);
    }
  }
}

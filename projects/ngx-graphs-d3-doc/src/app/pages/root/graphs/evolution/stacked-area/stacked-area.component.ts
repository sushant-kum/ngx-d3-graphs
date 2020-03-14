import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import UrlParse from 'url-parse';

/* Import Services */
import { TitleService } from '@doc/src/app/services/title/title.service';

/* Import Data models */
import { Tab } from '@doc/src/app/data-models/tab/tab';

@Component({
  selector: 'app-stacked-area',
  templateUrl: './stacked-area.component.html',
  styleUrls: ['./stacked-area.component.scss']
})
export class StackedAreaComponent implements OnInit {
  active_tab: Tab;
  readonly tabs: Tab[] = [
    {
      id: 'overview',
      name: 'Overview',
      router_link: ['overview']
    },
    {
      id: 'api',
      name: 'API',
      router_link: ['api']
    },
    {
      id: 'examples',
      name: 'Examples',
      router_link: ['examples']
    }
  ];

  constructor(private _title_svc: TitleService, private _router: Router) {}

  ngOnInit(): void {
    this._title_svc.setTitle('Stacked Area');

    // Set active_menu on navigation
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd && new UrlParse(this._router.url, true).pathname.includes('/stacked-area')) {
        this._setActiveTab();
      }
    });

    // Set active_menu
    if (new UrlParse(this._router.url, true).pathname.includes('/stacked-area')) {
      this._setActiveTab();
    }
  }

  private _setActiveTab(): void {
    const pathname: string = new UrlParse(this._router.url, true).pathname;
    const tab_id = pathname.includes('/stacked-area/') ? pathname.split('/stacked-area/')[1] : undefined;

    for (const tab of this.tabs) {
      if (tab_id === tab.id) {
        this.active_tab = tab;
        break;
      }
    }
  }
}

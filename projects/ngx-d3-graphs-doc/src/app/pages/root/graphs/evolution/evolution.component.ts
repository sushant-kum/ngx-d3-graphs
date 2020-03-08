import { Component, OnInit } from '@angular/core';

/* Import Services */
import { TitleService } from '@doc/src/app/serices/title/title.service';

/* Import Configs */
import { GRAPH_PAGES } from '@doc/src/app/config/config';

/* Import Data models */
import { Page } from '@doc/src/app/data-models/page/page';

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss']
})
export class EvolutionComponent implements OnInit {
  readonly evolution_sub_pages: Page[] = [];

  constructor(private _title_svc: TitleService) {}

  ngOnInit(): void {
    this._title_svc.setTitle('Evolution');

    this._setEvolutionSubPages();
  }

  /**
   * Set value of evolution_sub_pages
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @private
   * @memberof EvolutionComponent
   */
  private _setEvolutionSubPages(): void {
    for (const graph_page of GRAPH_PAGES) {
      if (graph_page.id === 'evolution') {
        for (const sub_page of graph_page.items) {
          this.evolution_sub_pages.push(sub_page);
        }
        break;
      }
    }
  }
}

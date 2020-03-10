import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatButton } from '@angular/material/button';

/* Import Services */
import { HelperService } from '@doc/src/app/services/helper/helper.service';
import { TitleService } from '@doc/src/app/services/title/title.service';

/* Import Configs */
import { GRAPH_PAGES } from '@doc/src/app/config/config';

interface MenuItem {
  id: string;
  name?: string;
  disabled?: boolean;
  router_link?: string[];
  absolute_link?: string;
  icon_path?: string;
}

interface MenuGroup extends MenuItem {
  items?: MenuItem[];
}

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {
  @ViewChild('graphs_left_menu_small_overlay') graphs_left_menu_small_overlay: ElementRef;
  @ViewChild('graphs_left_menu_small_toggle') graphs_left_menu_small_toggle: MatButton;
  @ViewChild('graphs_left_menu_small') graphs_left_menu_small: ElementRef;

  readonly menu_groups: MenuGroup[] = GRAPH_PAGES;

  active_menu: {
    group: string;
    item: string;
  };

  constructor(private _router: Router, private _title_svc: TitleService, public helper: HelperService) {}

  ngOnInit(): void {
    this._title_svc.setTitle('Graphs');

    // Set active_menu on navigation
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._hideGraphLeftMenuSmall();
        this._setActiveMenu();
      }
    });

    // Set active_menu
    this._setActiveMenu();
  }

  /**
   * Set active_menu
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @private
   * @memberof GraphsComponent
   */
  private _setActiveMenu(): void {
    const group = this._router.url.includes('/graphs/')
      ? this._router.url.split('/graphs/')[1].split('/')[0]
      : undefined;
    const item = group !== undefined ? this._router.url.split('/graphs/')[1].split('/')[1] : undefined;

    this.active_menu = {
      group: group === undefined ? null : group,
      item: item === undefined ? null : item
    };
  }

  /**
   * Toggle visibility of left menu on small screens
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @memberof GraphsComponent
   */
  toggleGraphLeftMenuSmallVisibility(): void {
    if (this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.contains('is-active')) {
      this._hideGraphLeftMenuSmall();
    } else {
      this._showGraphLeftMenuSmall();
    }
  }

  /**
   * Hide left menu on small screens
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @private
   * @memberof GraphsComponent
   */
  private _hideGraphLeftMenuSmall(): void {
    this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.remove('is-active');
    this.graphs_left_menu_small.nativeElement.classList.add('w3-hide');
    this.graphs_left_menu_small_overlay.nativeElement.classList.add('w3-hide');
  }

  /**
   * Show left menu on small screens
   *
   * @author Sushant Kumar <sushant.kum96@gmail.com>
   * @private
   * @memberof GraphsComponent
   */
  private _showGraphLeftMenuSmall(): void {
    this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.add('is-active');
    this.graphs_left_menu_small.nativeElement.classList.remove('w3-hide');
    this.graphs_left_menu_small_overlay.nativeElement.classList.remove('w3-hide');
  }

  /**
   * Handle click on quick links' sub-link
   *
   * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
   * @param {Event} event
   * @param {(string[] | string)} [link]
   * @param {boolean} [is_absolute]
   * @memberof GraphsComponent
   */
  onClickQuickLinkSublinks(event: Event, link?: string[] | string, is_absolute?: boolean): void {
    event.stopPropagation();
    if (link) {
      if (is_absolute && typeof link === 'string') {
        window.location.href = link;
      } else {
        this._router.navigate(link as string[]);
      }
    }
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatButton } from '@angular/material/button';

interface MenuItem {
  id: string;
  name?: string;
  disabled?: boolean;
  router_link?: string[];
  absolute_link?: string;
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
  @ViewChild('graphs_left_menu_small_toggle') graphs_left_menu_small_toggle: MatButton;
  @ViewChild('graphs_left_menu_small') graphs_left_menu_small: ElementRef;

  readonly menu_groups: MenuGroup[] = [
    {
      id: 'evolution',
      name: 'Evolution',
      items: [
        {
          id: 'stacked-area',
          name: 'Stacked Area'
        },
        {
          id: 'google',
          name: 'Google',
          absolute_link: 'http://google.com'
        }
      ]
    },
    {
      id: 'evolution',
      name: 'Evolution'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Set router_link of menu items
    for (const menu_group of this.menu_groups) {
      if (menu_group.items && menu_group.items.length > 0) {
        for (const menu_item of menu_group.items) {
          if (menu_item.absolute_link === undefined && menu_item.router_link === undefined) {
            menu_item.router_link = ['/', 'graphs', menu_group.id, menu_item.id];
          }
        }
      } else {
        if (menu_group.absolute_link === undefined && menu_group.router_link === undefined) {
          menu_group.router_link = ['/', 'graphs', menu_group.id];
        }
      }
    }
  }

  toggleGraphLeftMenuSmallVisibility(): void {
    if (this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.contains('is-active')) {
      this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.remove('is-active');
      this.graphs_left_menu_small.nativeElement.classList.add('w3-hide');
    } else {
      this.graphs_left_menu_small_toggle._elementRef.nativeElement.classList.add('is-active');
      this.graphs_left_menu_small.nativeElement.classList.remove('w3-hide');
    }
  }
}

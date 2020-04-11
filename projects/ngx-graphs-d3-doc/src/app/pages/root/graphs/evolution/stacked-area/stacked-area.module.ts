import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Angular Material imports */
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { StackedAreaRoutingModule } from './stacked-area-routing.module';
import { StackedAreaComponent } from './stacked-area.component';
import { SectionHeadModule } from '@doc/src/app/components/section-head/section-head.module';

@NgModule({
  declarations: [StackedAreaComponent],
  imports: [
    CommonModule,
    StackedAreaRoutingModule,
    SectionHeadModule,

    /* Angular Material */
    MatTabsModule,
    MatDividerModule,

    /* Fontawesome */
    FontAwesomeModule
  ]
})
export class StackedAreaModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    // fa_icon_library.addIcons(fasAngleRight, fasBookOpen);
    // Include regular fa icons
    // Include brand fa icons
  }
}

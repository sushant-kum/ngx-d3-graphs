import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Material imports */
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faExternalLinkSquareAlt as fasExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { StackedAreaOverviewRoutingModule } from './stacked-area-overview-routing.module';
import { StackedAreaOverviewComponent } from './stacked-area-overview.component';

import { SectionHeadModule } from '@doc/src/app/components/section-head/section-head.module';
import { TableOfContentModule } from '@doc/src/app/components/table-of-content/table-of-content.module';
import { UsageExampleModule } from '@doc/src/app/components/usage-example/usage-example.module';

@NgModule({
  declarations: [StackedAreaOverviewComponent],
  imports: [
    CommonModule,
    StackedAreaOverviewRoutingModule,
    SectionHeadModule,
    TableOfContentModule,
    UsageExampleModule,

    /* Angular Material */
    MatTabsModule,
    MatDividerModule,

    /* Fontawesome */
    FontAwesomeModule
  ]
})
export class StackedAreaOverviewModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasExternalLinkSquareAlt);
    // Include regular fa icons
    // Include brand fa icons
  }
}

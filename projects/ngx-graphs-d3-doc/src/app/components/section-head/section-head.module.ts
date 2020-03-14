import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Angular Material imports */
import { MatButtonModule } from '@angular/material/button';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faLink as fasLink } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { SectionHeadComponent } from './section-head.component';

@NgModule({
  declarations: [SectionHeadComponent],
  imports: [
    CommonModule,
    RouterModule,

    /* Angular Material */
    MatButtonModule,

    /* Fontawesome */
    FontAwesomeModule
  ],
  exports: [SectionHeadComponent]
})
export class SectionHeadModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasLink);
    // Include regular fa icons
    // Include brand fa icons
  }
}

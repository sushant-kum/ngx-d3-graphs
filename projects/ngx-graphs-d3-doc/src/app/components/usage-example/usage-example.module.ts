import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageExampleComponent } from './usage-example.component';

/* Angular Material imports */
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faExternalLinkAlt as fasExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { SafePipeModule } from '@doc/src/app/pipes/safe/safe-pipe.module';

@NgModule({
  declarations: [UsageExampleComponent],
  imports: [
    CommonModule,

    /* Angular Material */
    MatButtonModule,
    MatTooltipModule,

    /* Fontawesome */
    FontAwesomeModule,

    SafePipeModule
  ],
  exports: [UsageExampleComponent]
})
export class UsageExampleModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasExternalLinkAlt);
    // Include regular fa icons
    // Include brand fa icons
  }
}

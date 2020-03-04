import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Material imports */
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faBookOpen as fasBookOpen, faExternalLinkAlt as fasExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import { faClipboard as farClipboard } from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { ApiRoutingModule } from './api-routing.module';
import { ApiComponent } from './api.component';

@NgModule({
  declarations: [ApiComponent],
  imports: [
    CommonModule,
    ApiRoutingModule,

    /* Angular Material */
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,

    /* Fontawesome */
    FontAwesomeModule
  ]
})
export class ApiModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasBookOpen, fasExternalLinkAlt);
    // Include regular fa icons
    fa_icon_library.addIcons(farClipboard);
    // Include brand fa icons
  }
}

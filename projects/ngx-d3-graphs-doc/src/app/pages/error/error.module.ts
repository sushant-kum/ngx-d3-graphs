import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Material */
import { MatButtonModule } from '@angular/material/button';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faArrowLeft as fasArrowLeft, faHome as fasHome } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    ErrorRoutingModule,

    /* Angular Material */
    MatButtonModule,

    /* Fontawesome */
    FontAwesomeModule
  ]
})
export class ErrorModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasArrowLeft, fasHome);
    // Include regular fa icons
    // Include brand fa icons
  }
}

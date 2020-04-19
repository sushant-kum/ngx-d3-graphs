import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Angular Material imports */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faCode as fasCode } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,

    /* Angular Material */
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,

    /* Fontawesome */
    FontAwesomeModule,

    LoadingBarRouterModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasCode);
    // Include regular fa icons
    // Include brand fa icons
  }
}

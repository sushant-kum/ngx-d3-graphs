import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/* Angular Material imports */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import { faGithub as fabGithub } from '@fortawesome/free-brands-svg-icons';

import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,

    /* Angular Material */
    MatToolbarModule,
    MatButtonModule,

    /* Fontawesome */
    FontAwesomeModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    // Include regular fa icons
    // Include brand fa icons
    fa_icon_library.addIcons(fabGithub);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

/* Angular Material imports */
import { MatButtonModule } from '@angular/material/button';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

/* Other imports */
import { StackedAreaModule } from 'ngx-d3-graphs';

import { RootRoutingModule } from './root-routing.module';
import { RootComponent } from './root.component';

@NgModule({
  declarations: [RootComponent],
  imports: [
    CommonModule,
    RootRoutingModule,
    HttpClientModule,
    RouterModule,

    /* Angular Material */
    MatButtonModule,

    /* Fontawesome */
    FontAwesomeModule,

    /* Other */
    StackedAreaModule
  ]
})
export class RootModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    // Include regular fa icons
    // Include brand fa icons
    // fa_icon_library.addIcons(fabGithub);
  }
}

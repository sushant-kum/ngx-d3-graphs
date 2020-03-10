import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Material imports */
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faAngleRight as fasAngleRight, faBookOpen as fasBookOpen } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { EvolutionRoutingModule } from './evolution-routing.module';
import { EvolutionComponent } from './evolution.component';

@NgModule({
  declarations: [EvolutionComponent],
  imports: [
    CommonModule,
    EvolutionRoutingModule,
    /* Angular Material */
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,

    /* Fontawesome */
    FontAwesomeModule
  ]
})
export class EvolutionModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasAngleRight, fasBookOpen);
    // Include regular fa icons
    // Include brand fa icons
  }
}

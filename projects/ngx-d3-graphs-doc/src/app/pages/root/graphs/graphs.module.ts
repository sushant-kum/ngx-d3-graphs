import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Material imports */
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import {} from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

import { GraphsRoutingModule } from './graphs-routing.module';
import { GraphsComponent } from './graphs.component';

@NgModule({
  declarations: [GraphsComponent],
  imports: [
    CommonModule,
    GraphsRoutingModule,
    /* Angular Material */
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,

    /* Fontawesome */
    FontAwesomeModule
  ]
})
export class GraphsModule {}

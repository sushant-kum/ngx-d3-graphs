import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageExampleComponent } from './usage-example.component';

/* Angular Material imports */
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faExternalLinkAlt as fasExternalLinkAlt, faCode as fasCode } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import { faCopy as farCopy } from '@fortawesome/free-regular-svg-icons';
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
    MatTabsModule,
    MatDividerModule,
    MatCardModule,
    MatSnackBarModule,
    ClipboardModule,

    /* Fontawesome */
    FontAwesomeModule,

    SafePipeModule
  ],
  exports: [UsageExampleComponent]
})
export class UsageExampleModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasExternalLinkAlt, fasCode);
    // Include regular fa icons
    fa_icon_library.addIcons(farCopy);
    // Include brand fa icons
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';

/* Fontawesome Imports */
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
/* Solid Icons */
import { faCopyright as fasCopyright } from '@fortawesome/free-solid-svg-icons';
/* Regular Icons */
import {} from '@fortawesome/free-regular-svg-icons';
/* Brand Icons */
import {} from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    /* Fontawesome */
    FontAwesomeModule
  ],
  exports: [FooterComponent]
})
export class FooterModule {
  constructor(fa_icon_library: FaIconLibrary) {
    // Include solid fa icons
    fa_icon_library.addIcons(fasCopyright);
    // Include regular fa icons
    // Include brand fa icons
  }
}

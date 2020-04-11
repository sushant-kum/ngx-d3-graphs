import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

/* Angular Material imports */
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { TableOfContentComponent } from './table-of-content.component';

@NgModule({
  declarations: [TableOfContentComponent],
  imports: [
    CommonModule,
    RouterModule,

    /* Angular Material */
    MatListModule,
    MatButtonModule
  ],
  exports: [TableOfContentComponent]
})
export class TableOfContentModule {}

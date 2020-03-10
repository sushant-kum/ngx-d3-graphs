import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StackedAreaRoutingModule } from './stacked-area-routing.module';
import { StackedAreaComponent } from './stacked-area.component';

@NgModule({
  declarations: [StackedAreaComponent],
  imports: [CommonModule, StackedAreaRoutingModule]
})
export class StackedAreaModule {}

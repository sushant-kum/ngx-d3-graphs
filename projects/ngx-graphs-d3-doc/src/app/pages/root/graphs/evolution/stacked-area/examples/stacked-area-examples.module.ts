import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StackedAreaExamplesRoutingModule } from './stacked-area-examples-routing.module';
import { StackedAreaExamplesComponent } from './stacked-area-examples.component';

@NgModule({
  declarations: [StackedAreaExamplesComponent],
  imports: [CommonModule, StackedAreaExamplesRoutingModule]
})
export class StackedAreaExamplesModule {}

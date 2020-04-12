import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StackedAreaApiRoutingModule } from './stacked-area-api-routing.module';
import { StackedAreaApiComponent } from './stacked-area-api.component';

@NgModule({
  declarations: [StackedAreaApiComponent],
  imports: [CommonModule, StackedAreaApiRoutingModule]
})
export class StackedAreaApiModule {}

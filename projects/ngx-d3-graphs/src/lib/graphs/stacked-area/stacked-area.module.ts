import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoDataModule } from '../no-data/no-data.module';
import { StackedAreaComponent } from './stacked-area.component';

@NgModule({
  declarations: [StackedAreaComponent],
  imports: [CommonModule, NoDataModule],
  exports: [StackedAreaComponent]
})
export class StackedAreaModule {}

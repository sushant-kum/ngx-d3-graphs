import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvolutionRoutingModule } from './evolution-routing.module';
import { EvolutionComponent } from './evolution.component';

@NgModule({
  declarations: [EvolutionComponent],
  imports: [CommonModule, EvolutionRoutingModule]
})
export class EvolutionModule {}

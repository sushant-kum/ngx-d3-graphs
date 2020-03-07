import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphsComponent } from './graphs.component';

const routes: Routes = [
  {
    path: '',
    component: GraphsComponent,
    children: [
      {
        path: 'evolution',
        loadChildren: () =>
          import('@doc/src/app/pages/root/graphs/evolution/evolution.module').then(module => module.EvolutionModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphsRoutingModule {}

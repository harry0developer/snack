import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReAuthComponent } from './re-auth.component';

const routes: Routes = [
  {
    path: '',
    component: ReAuthComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReAuthComponentRoutingModule {}

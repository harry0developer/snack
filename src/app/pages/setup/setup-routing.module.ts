import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupComponent } from './setup.component';

const routes: Routes = [
  {
    path: '',
    component: SetupComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupComponentRoutingModule {}

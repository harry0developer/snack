import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { ChatComponent } from '../pages/chat/chat.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: Tab2Page},
      {path: ':id', component: ChatComponent}
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {QuestionsComponent} from './sites/questions/questions.component'
import { AppComponent } from './app.component';
import { IncidentComponent } from './sites/incident/incident.component';

const routes: Routes = [
  {path:"", redirectTo: 'incident',  pathMatch: 'full'},
  { path: 'incident', component: IncidentComponent , pathMatch: 'full' },
  { path: 'questions',      component: QuestionsComponent }]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }

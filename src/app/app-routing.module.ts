import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { HabitListComponent } from './habits/habit-list.component';
import { HabitDetailComponent } from './habits/habit-detail.component';
import { HabitReportComponent } from './habits/habit-report.component';

const routes: Routes = [
  { path: '', redirectTo: '/habits', pathMatch: 'full' },
  { path: 'habits', component: HabitListComponent },
  { path: 'habit/:id', component: HabitDetailComponent },
  { path: 'habit/:id/report', component: HabitReportComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
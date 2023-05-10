import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExcelComponent} from "./components/excel/excel.component";
import {SuffrenComponent} from "./components/suffren/suffren.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  { path: 'excel', component: ExcelComponent },
  { path: 'suffren/:id', component: SuffrenComponent, data:{ animationState: 'Suffren' } },
  { path: '', component: DashboardComponent, data:{ animationState: 'Dashboard' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

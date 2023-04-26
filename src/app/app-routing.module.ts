import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExcelComponent} from "./components/excel/excel.component";
import {SuffrenComponent} from "./components/suffren/suffren.component";

const routes: Routes = [
  { path: 'excel', component: ExcelComponent },
  { path: 'suffren', component: SuffrenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

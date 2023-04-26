import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import {opportunityReducer} from "./state/opportunity.reducer";
import { LineComponent } from './components/excel/line/line.component';
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ToggleButtonModule} from "primeng/togglebutton";
import {InputSwitchModule} from "primeng/inputswitch";
import {ButtonModule} from "primeng/button";
import {displayReducer} from "./state/display.reducer";
import { CellInputComponent } from './components/excel/cells/cell-input/cell-input.component';
import { CellComponent } from './components/excel/cells/cell/cell.component';
import { CellDropdownComponent } from './components/excel/cells/cell-dropdown/cell-dropdown.component';
import { CellTextComponent } from './components/excel/cells/cell-text/cell-text.component';
import { CellButtonComponent } from './components/excel/cells/cell-button/cell-button.component';
import { CellSwitchComponent } from './components/excel/cells/cell-switch/cell-switch.component';
import { CellAutocompleteComponent } from './components/excel/cells/cell-autocomplete/cell-autocomplete.component';
import {ExcelComponent} from "./components/excel/excel.component";
import { SuffrenComponent } from './components/suffren/suffren.component';
import {suffrenReducer} from "./state/suffren.reducer";
import {SidebarModule} from "primeng/sidebar";
import {PanelModule} from "primeng/panel";
import {InputNumberModule} from "primeng/inputnumber";
import {FieldsetModule} from "primeng/fieldset";
import {BadgeModule} from "primeng/badge";
import {ChipModule} from "primeng/chip";
import localeFr from '@angular/common/locales/fr';
import {registerLocaleData} from "@angular/common";
import {ContextMenuModule} from "primeng/contextmenu";
import {DividerModule} from "primeng/divider";
import { LineFormComponent } from './components/suffren/line-form/line-form.component';
import {AccordionModule} from "primeng/accordion";
import {MessageModule} from "primeng/message";
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    ExcelComponent,
    LineComponent,
    CellInputComponent,
    CellComponent,
    CellDropdownComponent,
    CellTextComponent,
    CellButtonComponent,
    CellSwitchComponent,
    CellAutocompleteComponent,
    SuffrenComponent,
    LineFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoreModule.forRoot({
      opportunity: opportunityReducer, //etat de l'opportunité
      display: displayReducer, //etat lié à l'affichage
      suffren: suffrenReducer // etat pour l'affichage de suffren
    }),
    HttpClientModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    AutoCompleteModule,
    ToggleButtonModule,
    InputSwitchModule,
    ButtonModule,
    SidebarModule,
    PanelModule,
    InputNumberModule,
    FieldsetModule,
    BadgeModule,
    ChipModule,
    ContextMenuModule,
    DividerModule,
    AccordionModule,
    MessageModule,
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'fr-FR' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }

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
import {TableModule} from "primeng/table";
import {KnobModule} from "primeng/knob";
import {SliderModule} from "primeng/slider";
import {DialogModule} from "primeng/dialog";
import { DiscountFormComponent } from './components/suffren/discount-form/discount-form.component';
import { PriceFormComponent } from './components/suffren/price-form/price-form.component';
import { AbstractFormComponent } from './components/suffren/abstract-form/abstract-form.component';
import {ProductFormComponent} from "./components/suffren/product-form/product-form.component";
import {ServiceFormComponent} from "./components/suffren/service-form/service-form.component";
import {FocusTrapModule} from "primeng/focustrap";
import {ToastModule} from "primeng/toast";
import { KeyboardNavComponent } from './components/suffren/keyboard-nav/keyboard-nav.component';
import {MessageService} from "primeng/api";
import { HeaderComponent } from './components/suffren/header/header.component';
import { ProductSelectorComponent } from './components/suffren/product-selector/product-selector.component';
import {TabViewModule} from "primeng/tabview";
import {RippleModule} from "primeng/ripple";
import {CommentFormComponent} from "./components/suffren/comment-form/comment-form.component";
import {CommercialFormComponent} from "./components/suffren/commercial-form/commercial-form.component";
import {ProductionFormComponent} from "./components/suffren/production-form/production-form.component";
import {CheckboxModule} from "primeng/checkbox";
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
    LineFormComponent,
    DiscountFormComponent,
    PriceFormComponent,
    ProductFormComponent,
    AbstractFormComponent,
    ServiceFormComponent,
    KeyboardNavComponent,
    HeaderComponent,
    ProductSelectorComponent,
    CommentFormComponent,
    CommercialFormComponent,
    ProductionFormComponent
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
    TableModule,
    KnobModule,
    SliderModule,
    DialogModule,
    FocusTrapModule,
    ToastModule,
    TabViewModule,
    RippleModule,
    CheckboxModule,
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'fr-FR' }, MessageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }

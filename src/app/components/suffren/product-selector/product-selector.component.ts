import {Component, ViewChild} from '@angular/core';
import {AbstractFormComponent} from "../abstract-form/abstract-form.component";
import {selectCurrentComponent, selectCurrentLineIndex} from "../../../state/suffren.selector";
import {AutoComplete} from "primeng/autocomplete";
import {FormBuilder} from "@angular/forms";
import {Store} from "@ngrx/store";
import {ComponentManagerService} from "../../../services/component-manager.service";
import {take, tap} from "rxjs/operators";
import {SuffrenActions} from "../../../state/suffren.action";
import {ProductType} from "../../../model/data/icomponent.model";

@Component({
  selector: 'app-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss']
})
export class ProductSelectorComponent extends AbstractFormComponent{
  @ViewChild('shapeInput') shapeInput!: AutoComplete;

  currentLineIndex$ = this.store.select(selectCurrentLineIndex)
  override subFormKey = 'productSelectorForm';
  filteredShape: any[]
  shapes = ['NBR', 'NTL']
  shape:string|null = null
  clientRef:string|null = null

  constructor(
    protected override store: Store,
    protected override fb: FormBuilder,
    protected componentManager: ComponentManagerService
  ) {
    super(store, fb);
  }

  filterShape(event:any): void {
    let query = event.query;
    this.filteredShape = this.shapes.filter((g)=>g.indexOf(query.toLowerCase())!==-1)
  }

  show(): void {
    setTimeout(()=>{
      this.shapeInput?.focusInput()

    }, 100)
  }

  submitShape(data:any ) {
    this.currentLineIndex$.pipe(
      take(1),
      tap((index) => {
        switch(this.shape?.toUpperCase()) {
          case 'NBR':
            this.componentManager.addLine(index, ProductType.long, this.shape)
            this.store.dispatch(SuffrenActions.openSubForm({key:'productSelectorForm', display:{show:false}}))
            break;
          case 'NTL':
          case 'NTLL':
            this.componentManager.addLine(index, ProductType.plat, this.shape)
            this.store.dispatch(SuffrenActions.openSubForm({key:'productSelectorForm', display:{show:false}}))
            break;
          case 'PSP':
            this.componentManager.addLine(index, ProductType.psp, this.shape)
            this.store.dispatch(SuffrenActions.openSubForm({key:'productSelectorForm', display:{show:false}}))
            break;
          default:
            alert('Unknown shape '+this.shape)
        }
      })
    ).subscribe()
  }
}

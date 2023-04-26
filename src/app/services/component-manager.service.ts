import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {IComponent, IProduitLong, IProduitPlat, IPSP, ProductType} from "../model/data/icomponent.model";
import {OpportunityActions} from "../state/opportunity.action";
import {combineLatest} from "rxjs";
import {selectCurrentLine, selectCurrentLineIndex} from "../state/suffren.selector";
import {take, tap} from "rxjs/operators";
import {SuffrenActions} from "../state/suffren.action";

@Injectable({
  providedIn: 'root'
})
export class ComponentManagerService {

  constructor(private store: Store) {}

  addLine(lineIndex: number|null=null, type: string, shape?: string) {
    this.store.dispatch(OpportunityActions.addLine({index:lineIndex}))
    this.setupNewLine(type, shape??'')
    this.store.dispatch(SuffrenActions.openSubForm({key:'productForm', display:{show:true}}))
  }

  setupNewLine(type:string, shape: string): void {
    combineLatest(this.store.select(selectCurrentLine),this.store.select(selectCurrentLineIndex)).pipe(
      take(1),
      tap(([line, index])=>{
        let base: IComponent = {
          description: "", margin: 0, quantity: 0, total: 0, type: 'material', unitCost: 0, unitPrice: 0
        }
        switch (type) {
          case ProductType.long:
            let produitLong: IProduitLong = {
              ...base, type: ProductType.long, shape,grade:'', dimensions:'', lengthType:'SL', length:0
            }
            this.store.dispatch(OpportunityActions.addComponent({lineIndex:index, component:produitLong}))
            break;
          case ProductType.plat:
            let produitPlat: IProduitPlat  = {
              ...base, type:ProductType.plat, shape,grade:'', dimensions:''
            }
            this.store.dispatch(OpportunityActions.addComponent({lineIndex:index, component:produitPlat}))
            break;
          case ProductType.psp:
            let psp: IPSP  = {
              ...base, type:ProductType.psp,grade:'', dimensions:''
            }
            this.store.dispatch(OpportunityActions.addComponent({lineIndex:index, component:psp}))
            break;
          default:
            alert('Setup new line : unknown type '+type)
        }
      })
    ).subscribe()
  }
}

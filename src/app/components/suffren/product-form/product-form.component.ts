import {Component, ElementRef, ViewChild} from '@angular/core';
import {AbstractFormComponent} from "../abstract-form/abstract-form.component";
import {takeUntil, tap} from "rxjs/operators";
import {
  IAccessoire,
  IComponent,
  IProduitLong,
  IProduitPlat,
  IPSP,
  ProductType
} from "../../../model/data/icomponent.model";
import {FormGroup} from "@angular/forms";
import {AutoComplete} from "primeng/autocomplete";
import {distinctUntilChanged, Subject} from "rxjs";
import {OpportunityActions} from "../../../state/opportunity.action";
import {selectCurrentLineIndex} from "../../../state/suffren.selector";
import {SuffrenActions} from "../../../state/suffren.action";
import {Line} from "../../../model/data/line.model";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent extends AbstractFormComponent{
  override subFormKey = 'productForm'
  @ViewChild('firstLong') firstLong!: AutoComplete;
  @ViewChild('firstPlat') firstPlat!: AutoComplete;
  @ViewChild('firstPsp') firstPsp!: AutoComplete;

  material: undefined|IComponent|IProduitLong|IProduitPlat
  materialIndex: number
  lineIndex: number
  form: FormGroup
  productType = ProductType
  filteredGrade: any[]
  filteredShape: any[]
  grades = ['1.4301', '1.4404']
  shapes = ['NBR', 'NTL']
  lengthTypes = [{label:'FL', value:'FL'}, {label:'SL', value:'SL'}]

  currentLineIndex$ = this.store.select(selectCurrentLineIndex)


  override ngOnInit(): void {
    super.ngOnInit()
    this.currentLineIndex$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((a,b)=>a===b),
      tap((index) => {
        this.focusOut()
        this.lineIndex = index
        this.show()
      })
    ).subscribe();
    this.currentLine$.pipe(
      takeUntil(this.destroy$),
      tap((line) => {
        if (line) {
          this.material = line.components.find((c) => Object.values(ProductType).find((t) => t === c.type))
          this.materialIndex = line.components.findIndex((c) => Object.values(ProductType).find((t) => t === c.type))
          if (this.material) {
            switch (this.material.type) {
              case ProductType.long:
                this.form = this.fb.group({
                  shape: [(this.material as IProduitLong).shape],
                  grade: [(this.material as IProduitLong).grade],
                  dimensions: [(this.material as IProduitLong).dimensions],
                  lengthType: [(this.material as IProduitLong).lengthType],
                  length: [(this.material as IProduitLong).length],
                  quantity: [this.material.quantity],
                })
                break;
              case ProductType.plat:
                this.form = this.fb.group({
                  shape: [(this.material as IProduitPlat).shape],
                  grade: [(this.material as IProduitPlat).grade],
                  dimensions: [(this.material as IProduitPlat).dimensions],
                  quantity: [this.material.quantity],
                })
                break;
              case ProductType.psp:
                this.form = this.fb.group({
                  grade: [(this.material as IProduitPlat).grade],
                  dimensions: [(this.material as IProduitPlat).dimensions],
                  quantity: [this.material.quantity],
                })
                break;
            }
          }
        }
      })
    ).subscribe()
  }

  filterGrade(event:any): void {
    let query = event.query;
    this.filteredGrade = this.grades.filter((g)=>g.indexOf(query.toLowerCase())!==-1)
  }

  filterShape(event:any): void {
    let query = event.query;
    this.filteredShape = this.shapes.filter((g)=>g.indexOf(query.toLowerCase())!==-1)
  }
  show(): void {
    setTimeout(()=>{
      this.firstLong?.focusInput()
      this.firstPlat?.focusInput()
    }, 100)
  }

  focusOut(): void {
    if(this.form) {
      const newComponent = {
        ...this.material,
        ...this.form.value
      }
      if(JSON.stringify(newComponent)!==JSON.stringify(this.material)){
        this.store.dispatch(OpportunityActions.updateComponent({component:newComponent, lineIndex:this.lineIndex, componentIndex:this.materialIndex}))
      }
    }
  }

  copy(): void {
    this.store.dispatch(OpportunityActions.copyLine({ index:this.lineIndex }))
  }

  showSubForm(subform: string): void {
    this.store.dispatch(SuffrenActions.openSubForm({key:subform, display:{show:true}}))
  }

  isService(component:IComponent|IProduitLong|IProduitPlat|IAccessoire|IPSP): boolean {
    return !Object.values(ProductType).find((t) => t === component.type)
  }

  removeComponent(index:number):void {
    this.store.dispatch(OpportunityActions.removeComponent({lineIndex:this.lineIndex, index}))
  }
  displayComponentForm():void {
    this.store.dispatch(SuffrenActions.openSubForm({key:'serviceForm', display:{show:true}}))
  }
  addComponent(type:string): void {

    const serviceDefinitions = [
      {code:'certif2.1', label:'Certificat 2.1', price:5, cost:1},
      {code:'certif3.1', label:'Certificat 3.1', price:10, cost:2},
      {code:'certif3.2', label:'Certificat 3.2', price:100, cost:15},
      {code:'sciage', label:'Sciage', price:1, cost:0.5},
      {code:'laser', label:'Découpe laser', price:10, cost:3},
      {code:'waterjet', label:"Découpe jet d'eau", price:25, cost:10},
      {code:'plasma', label:"Découpe jet d'eau", price:20, cost:4},
      {code:'polissage', label:"Polissage", price:10, cost:5},
      {code:'ebavurage', label:"Ebavurage", price:10, cost:5},
      {code:'percage', label:"Percage", price:10, cost:5},
      {code:'taraudage', label:"Taraudage", price:10, cost:5},
      {code:'rectification', label:"Rectification", price:10, cost:5},
      {code:'fraisage', label:"Fraisage", price:10, cost:5},
      {code:'tournage', label:"Tournage", price:10, cost:5},
    ]
    const component:IComponent = {
      description: "Service inconnu", quantity: 1, type: "service", unitCost: 0, unitPrice: 0
    }
    serviceDefinitions.forEach((service)=> {
      if(service.code === type) {
        component.description = service.label
        component.unitPrice = service.price
        component.unitCost = service.cost
      }
    })
    this.store.dispatch(OpportunityActions.addComponent({lineIndex:this.lineIndex, component}))
  }

  getProductType(line: Line): string {
    const material = line.components.find((c) => Object.values(ProductType).find((t) => t === c.type))
    return material?.type??''
  }
}

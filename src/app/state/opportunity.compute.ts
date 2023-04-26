import { createReducer, on } from '@ngrx/store';
import {OpportunityActions, TableauApiActions} from "./opportunity.action";
import {Opportunity} from "../model/state/opportunity.model";
import {Line} from "../model/data/line.model";
import {IComponent, IProduitLong, IProduitPlat, IPSP, ProductType} from "../model/data/icomponent.model";


export class OpportunityCompute {

  public static addToHistory(state:Opportunity): ReadonlyArray<Opportunity> {
    const newHistory = [...state.history];
    newHistory.splice(state.historyStep)
    newHistory.push({tableau : state.tableau, history:[], historyStep:-1});
    return newHistory;
  }

  public static calculateLine(line:Line, index:number): Line {
    let materialComponent = line.components.find((c)=>Object.values(ProductType).find((t)=>t===c.type))
    let description = 'non résolu'
    let name: string|undefined = ''
    if(materialComponent){
      switch (materialComponent.type) {
        case ProductType.long:
          const pl = materialComponent as IProduitLong;
          name = pl.shape;
          if (name === 'NBR') {
            name = 'Barre ronde'
          }
          description = `${name} ${pl.dimensions}, ${pl.grade}`
          break;
        case ProductType.plat:
          const pp = materialComponent as IProduitLong;
          name = pp.shape;
          if (name === 'NTL') {
            name = 'Tôle'
          }
          description = `${name} ${pp.dimensions}, ${pp.grade}`
          break;
        case ProductType.psp:
          const psp = materialComponent as IProduitLong;
          description = `Piece sur plan :${psp.dimensions}, ${psp.grade}`
          break;
      }
    }

    const components = line.components.map((component) => this.calculateComponent(component))
    let totalCost= 0
    let totalPrice= 0
    let quantity= 0
    let warning: string|undefined
    components.forEach((component)=> {
      totalCost+=component.quantity*component.unitCost
      totalPrice+=component.total
      if(line.components.find((c)=>Object.values(ProductType).find((t)=>t===component.type))) {
        quantity = component.quantity
      }
      if(component.type==='service' && component.description==='Découpe' && component.total==0) {
        warning='Découpe offerte'
      }
    })
    const totalDiscount = totalPrice*(line.discount/100)
    totalPrice = totalPrice-totalDiscount
    return {...line,
      id:`${index+1}`,
      totalPrice,
      totalCost,
      totalDiscount,
      margin:Math.round((totalPrice-totalCost)/totalCost*100),
      quantity,
      unitPrice:totalPrice/quantity,
      unitCost:totalCost/quantity,
      description,
      components,
      warning
    };
  }

  public static calculateComponent(component:IComponent): IComponent {
    let description='';
    switch(component.type) {
      case "long":
        description = `${(component as IProduitLong).shape} ${(component as IProduitLong).dimensions}, ${(component as IProduitLong).grade}  ${(component as IProduitLong).lengthType} ${(component as IProduitLong).length}`
        break;
      case "plat":
        description = `${(component as IProduitPlat).shape} ${(component as IProduitPlat).dimensions}, ${(component as IProduitPlat).grade}`
        break;
      case "psp":
        description = `RC ${(component as IPSP).dimensions}, ${(component as IPSP).grade}`
        break;
    }
    if(component.type ==='service') {
      description = `${component.description}`;
    }
    const total = Math.round(component.unitPrice * component.quantity *100)/100;
    return {...component,total, description, margin: Math.round((component.unitPrice-component.unitCost)/component.unitCost*100)};
  }
}


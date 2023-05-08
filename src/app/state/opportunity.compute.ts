import {Opportunity} from "../model/data/opportunity.model";
import {Line} from "../model/data/line.model";
import {IComponent, IProduitLong, IProduitPlat, IPSP, ProductType} from "../model/data/icomponent.model";


export class OpportunityCompute {

  public static addToHistory(state:Opportunity): ReadonlyArray<Opportunity> {
    const newHistory = [...state.history];
    newHistory.splice(state.historyStep)
    newHistory.push({reference: state.reference, id: state.id, versions: state.versions, tableau : state.tableau, history:[], historyStep:-1});
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

    const components = line.components.map((component) => this.calculateComponent(component, line))
    let totalCost= 0
    let totalPrice= 0
    let totalDiscount= 0
    let quantity= 0
    let warning: string|undefined
    components.forEach((component)=> {
      totalCost+=component.totalCost??0
      totalPrice+=component.totalPriceWithoutDiscount??0
      totalDiscount+=component.totalDiscount??0
      if(line.components.find((c)=>Object.values(ProductType).find((t)=>t===component.type))) {
        quantity = component.quantity
      }
      if(component.type==='service' && component.description==='Découpe' && (component.totalPrice??0)===0) {
        warning='Découpe offerte'
      }
    })
    const totalPriceWithoutDiscount = totalPrice
    totalPrice = totalPrice-totalDiscount

    return {...line,
      id:`${index+1}`,
      totalPrice,
      totalCost,
      totalDiscount,
      totalPriceWithoutDiscount,
      relativeMargin:Math.round((totalPrice-totalCost)/totalCost*100),
      absoluteMargin:Math.round(totalPrice-totalCost),
      quantity,
      unitPrice:totalPriceWithoutDiscount/quantity,
      unitPriceDiscounted:totalPrice/quantity,
      unitPriceWithoutDiscount: totalPriceWithoutDiscount/quantity,
      unitCost:totalCost/quantity,
      description,
      components,
      warning
    };
  }

  public static calculateComponent(component:IComponent, line: Line): IComponent {
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

    const unitPriceWithoutDiscount = (component.unitPrice??0)
    const unitDiscount = unitPriceWithoutDiscount * line.discount / 100
    const unitPriceDiscounted = unitPriceWithoutDiscount - unitDiscount
    const totalPrice = unitPriceDiscounted * component.quantity
    const totalCost = (component.unitCost??0) * component.quantity
    const totalPriceWithoutDiscount = unitPriceWithoutDiscount * component.quantity
    const totalDiscount = totalPriceWithoutDiscount * line.discount / 100
    const absoluteMargin = totalPrice-totalCost
    const relativeMargin = Math.round((totalPrice - totalCost) / (totalCost) * 100)

    return {
      ...component,
      unitPriceWithoutDiscount,
      unitPriceDiscounted,
      unitDiscount,
      absoluteMargin,
      relativeMargin,
      totalPriceWithoutDiscount,
      totalPrice,
      totalCost,
      totalDiscount,
      description,
    }
  }
}


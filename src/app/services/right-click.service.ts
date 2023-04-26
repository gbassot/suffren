import { Injectable } from '@angular/core';
import {IComponent} from "../model/data/icomponent.model";
import {MenuItem} from "primeng/api";
import {OpportunityActions} from "../state/opportunity.action";
import {SuffrenActions} from "../state/suffren.action";
import {Store} from "@ngrx/store";
import {ComponentManagerService} from "./component-manager.service";

@Injectable({
  providedIn: 'root'
})
export class RightClickService {

  constructor(
    private store: Store,
    private componentManager: ComponentManagerService
  ) { }

  getItemMenu(lineIndex: number|null=null,componentIndex: number|null=null, component: IComponent|null=null): MenuItem[] {
    const items : MenuItem[] = [];

    const createLine : MenuItem[] = [];
    createLine.push( {
      label: 'Ajouter une ligne',
      items: [
        {label: 'Produit long', command: () => this.componentManager.addLine((lineIndex!==null?lineIndex+1:null),'long')},
        {label: 'Produit plat', command: () => this.componentManager.addLine((lineIndex!==null?lineIndex+1:null),'plat')},
        {label: 'Accessoires', command: () => this.componentManager.addLine((lineIndex!==null?lineIndex+1:null),'accessoire')},
        {label: 'Pièce découpée', command: () => this.componentManager.addLine((lineIndex!==null?lineIndex+1:null),'psp')},
        {label: "A partir d'une référence client" , command: () => this.componentManager.addLine((lineIndex!==null?lineIndex+1:null),'reference')},
        {label: "A partir de l'historique client" , command: () => this.componentManager.addLine((lineIndex!==null?lineIndex+1:null),'historique')},
      ]
    })
    if(lineIndex!==null && componentIndex!==null) {
      items.push({label: 'Supprimer '+(component?(component.description):''), command: () => this.store.dispatch(OpportunityActions.removeComponent({lineIndex, index:componentIndex}))})
    }
    if(lineIndex!==null) {
      items.push(
        {label: 'Définir le produit', icon:'fa-solid fa-shapes', command: () => this.store.dispatch(SuffrenActions.openSubForm({key:'productForm', display:{show:true}}))},
        {label: 'Affecter le prix', icon:'fa-solid fa-euro-sign', command: () => this.store.dispatch(SuffrenActions.openSubForm({key:'priceForm', display:{show:true}}))},
        {
          label: 'Frais additionnel', icon:'fa-solid fa-cart-plus',
          items: [
            {
              label: 'Ajouter un certificat', icon: 'fa-solid fa-file',
              items: [
                {label: 'Certificat 2.1', command: () => this.store.dispatch(SuffrenActions.openSubForm({key:'serviceForm', display:{show:true}}))},
                {label: 'Certificat 3.1', command: () => alert('Not implemented')},
                {label: 'Certificat 3.2', command: () => alert('Not implemented')},
              ]
            },
            {
              label: 'Ajouter une découpe',icon: 'fa-solid fa-scissors',
              items: [
                {label: 'Sciage', command: () => alert('Not implemented')},
                {label: 'Laser', command: () => alert('Not implemented')},
                {label: 'Plasma', command: () => alert('Not implemented')},
                {label: "Jet d'eau", command: () => alert('Not implemented')},
              ]
            },
            {
              label: 'Ajouter une finition',icon: 'fa-solid fa-brush',
              items: [
                {label: 'Polissage', command: () => alert('Not implemented')},
                {label: 'Ebavurage', command: () => alert('Not implemented')},
              ]
            },
            {
              label: 'Ajouter une opération',icon: 'fa-solid fa-screwdriver-wrench',
              items: [
                {label: 'Marquage', command: () => alert('Not implemented')},
                {label: 'Percage', command: () => alert('Not implemented')},
                {label: 'Taraudage', command: () => alert('Not implemented')},
              ]
            },
            {
              label: 'Ajouter un frais',icon: 'fa-solid fa-truck-fast',
              items: [
                {label: "Frais d'emballage", command: () => alert('Not implemented')},
                {label: 'Frais de transport', command: () => alert('Not implemented')},
              ]
            },
          ]
        },
        {label: 'Choisir une remise', icon:'fa-regular fa-percent', command: () => this.store.dispatch(SuffrenActions.openSubForm({key:'discountForm', display:{show:true}}))},
        {
          label: 'Edition',
          items: [
            {label: 'Copier la ligne '+(lineIndex+1), command: () => this.store.dispatch(OpportunityActions.copyLine({index:(lineIndex)}))},
            {label: 'Supprimer la ligne '+(lineIndex+1), command: () => this.store.dispatch(OpportunityActions.removeLine({index:(lineIndex)}))},
          ]
        }
      )
    }
    items.push(...createLine)
    return items;
  }
}

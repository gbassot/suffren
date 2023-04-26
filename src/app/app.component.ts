import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Line} from "./model/data/line.model";
import {TableauApiActions} from "./state/opportunity.action";
import {IProduitLong, ProductType} from "./model/data/icomponent.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private store: Store) {}

  ngOnInit(): void {
    const tableau: Array<Line> = [
      {id:'1', description:'', totalPrice: 0, totalCost:0,totalDiscount:0, margin: 126, unitCost:0, unitPrice:0, quantity:0,discount:10,
        components:[
          {type: ProductType.long, description:'', shape:'NBR', grade:'1.4301', dimensions:'15', length: 240, lengthType:'FL', unitPrice:3.5, unitCost:3, quantity:3, total:0, margin:0},
          {type:'service', description:'Sciage', unitPrice:1,unitCost:0.75, quantity:3, total:0, margin:0},
          {type:'service', description:'Certificat 3.1', unitPrice:10,unitCost:2, quantity:1, total:0, margin:0},
        ]
      },
      {id:'2', description:'', totalPrice: 0, totalCost:0,totalDiscount:0, margin:0, unitCost:0, unitPrice:0, quantity:0,discount:0,
        components:[
          {type:ProductType.long, description:'', shape:'NBR', grade:'1.4301', dimensions:'18', length: 870, lengthType:'FL', unitPrice:4.2,unitCost:3.8, quantity:7, total:0, margin:0},
          {type:'service', description:'Découpe', unitPrice:0,unitCost:1, quantity:7, total:0, margin:0}
        ]},
      {id:'3', description:'', totalPrice: 0, totalCost:0,totalDiscount:0, margin:0, unitCost:0, unitPrice:0, quantity:0,discount:0,
        components:[
          {type:ProductType.plat, description:'', shape:'NTL', grade:'1.4404', dimensions:'2000/500/4', unitPrice:8.65,unitCost:7.20, quantity:7, total:0, margin:0},
        ]},
      {id:'4', description:'', totalPrice: 0, totalCost:0,totalDiscount:0, margin:0, unitCost:0, unitPrice:0, quantity:0,discount:20,
        components:[
          {type:ProductType.psp, description:'', grade:'1.4404', dimensions:'110/200/2', unitPrice:25.30,unitCost:15, quantity:2, total:0, margin:0},
          {type:'service', description:'Découpe laser longueur 370mm', unitPrice:8,unitCost:3, quantity:2, total:0, margin:0},
          {type:'service', description:'4 trous diam 12mm', unitPrice:1,unitCost:0.4, quantity:2, total:0, margin:0},
          {type:'service', description:'18 trous diam 18mm', unitPrice:2.6,unitCost:0.9, quantity:2, total:0, margin:0},
          {type:'service', description:'Taraudage 4 trous 12mm pas 1/.75', unitPrice:0.4,unitCost:0.1, quantity:2, total:0, margin:0},
          {type:'service', description:'Certificat 3.1', unitPrice:10,unitCost:2, quantity:1, total:0, margin:0},
        ]},
    ];
    this.store.dispatch(TableauApiActions.retrievedTableauList({ tableau }))
  }

}

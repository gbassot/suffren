import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Line} from "./model/data/line.model";
import {TableauApiActions} from "./state/opportunity.action";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private store: Store) {}

  ngOnInit(): void {
    const tableau: Array<Line> = [
      {id:'1', description:'', totalPrice: 0, totalCost:0, margin: 126, unitCost:0, unitPrice:0, quantity:0,
        components:[
          {type:'material', description:'', shape:'NBR', grade:'1.4301', dimensions:'15', length: 240, lengthType:'FL', unitPrice:3.5, unitCost:3, quantity:3, total:0, margin:0},
          {type:'service', description:'Certificat', unitPrice:10,unitCost:2, quantity:1, total:0, margin:0},
          {type:'service', description:'Découpe', unitPrice:3.5,unitCost:2, quantity:3, total:0, margin:0}
        ]
      },
      {id:'2', description:'', totalPrice: 0, totalCost:0, margin:0, unitCost:0, unitPrice:0, quantity:0,
        components:[
          {type:'material', description:'', shape:'NBR', grade:'1.4301', dimensions:'18', length: 870, lengthType:'FL', unitPrice:4.2,unitCost:3.8, quantity:7, total:0, margin:0},
          {type:'service', description:'Découpe', unitPrice:0,unitCost:1, quantity:7, total:0, margin:0}
        ]},
      {id:'3', description:'', totalPrice: 0, totalCost:0, margin:0, unitCost:0, unitPrice:0, quantity:0,
        components:[
          {type:'material', description:'', shape:'NBR', grade:'1.4404', dimensions:'12', length: 3000, lengthType:'SL', unitPrice:8.65,unitCost:7.20, quantity:7, total:0, margin:0},
        ]},
    ];
    this.store.dispatch(TableauApiActions.retrievedTableauList({ tableau }))
  }

}

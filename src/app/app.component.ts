import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Line} from "./model/data/line.model";
import {OpportunityActions} from "./state/opportunity.action";
import {ProductType} from "./model/data/icomponent.model";
import {RouterOutlet} from "@angular/router";
import { routeTransitionAnimations } from './route-transition-animations';
import {MenuItem} from "primeng/api";
import {QuoteActions} from "./state/quote.action";
import {selectAllOpportunities, selectCurrentOpportunity} from "./state/quote.selector";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations]
})
export class AppComponent implements OnInit, OnDestroy{
  opportunity$ = this.store.select(selectCurrentOpportunity);
  destroy$ = new Subject();
  constructor(private store: Store) {}

  items: MenuItem[] = [{ label: 'Dashboard', routerLink:'/' },{ label: 'Opportunité #1', routerLink:'/suffren' }]


  ngOnInit(): void {
    this.opportunity$.pipe(
      takeUntil(this.destroy$),
      tap((opportunity) => {
        const items: MenuItem[]  = [{ label: 'Opportunités', routerLink:'/', command:() => this.store.dispatch(QuoteActions.selectOpportunity({index:-1})) }]
        if(opportunity) {
          items.push({ label: `Opportunité ${opportunity.reference}`, routerLink:'/suffren' });
        }
        this.items = items
      })
    ).subscribe();
    const tableau: Array<Line> = [
      {id:'1', description:'', quantity:0, discount:10,
        components:[
          {type: ProductType.long, description:'', shape:'NBR', grade:'1.4301', dimensions:'15', length: 240, lengthType:'FL', unitPrice:3.5, unitCost:3, quantity:3},
          {type:'service', description:'Sciage', unitPrice:1,unitCost:0.75, quantity:3},
          {type:'service', description:'Certificat 3.1', unitPrice:10,unitCost:2, quantity:1},
        ]
      },
      {id:'2', description:'', quantity:0,discount:0,
        components:[
          {type:ProductType.long, description:'', shape:'NBR', grade:'1.4301', dimensions:'18', length: 870, lengthType:'FL', unitPrice:4.2,unitCost:3.8, quantity:7},
          {type:'service', description:'Découpe', unitPrice:0,unitCost:1, quantity:7}
        ]},
      {id:'3', description:'', quantity:0,discount:0,
        components:[
          {type:ProductType.plat, description:'', shape:'NTL', grade:'1.4404', dimensions:'2000/500/4', unitPrice:8.65,unitCost:7.20, quantity:7},
        ]},
      {id:'4', description:'', quantity:0,discount:20,
        components:[
          {type:ProductType.psp, description:'', grade:'1.4404', dimensions:'110/200/2', unitPrice:25.30,unitCost:15, quantity:2},
          {type:'service', description:'Découpe laser longueur 370mm', unitPrice:8,unitCost:3, quantity:2},
          {type:'service', description:'4 trous diam 12mm', unitPrice:1,unitCost:0.4, quantity:2},
          {type:'service', description:'18 trous diam 18mm', unitPrice:2.6,unitCost:0.9, quantity:2},
          {type:'service', description:'Taraudage 4 trous 12mm pas 1/.75', unitPrice:0.4,unitCost:0.1, quantity:2},
          {type:'service', description:'Certificat 3.1', unitPrice:10,unitCost:2, quantity:1},
        ]},
    ];
    const tableau2: Array<Line> = [
      {id:'1', description:'', quantity:0,discount:10,
        components:[
          {type: ProductType.long, description:'', shape:'NBR', grade:'1.4301', dimensions:'15', length: 240, lengthType:'FL', unitPrice:3.5, unitCost:3, quantity:3},
          {type:'service', description:'Sciage', unitPrice:1,unitCost:0.75, quantity:3},
          {type:'service', description:'Certificat 3.1', unitPrice:10,unitCost:2, quantity:1},
        ]
      },
    ];
    this.store.dispatch(QuoteActions.loadOpportunities({ opportunities: [
        {id: 2, versions:[{name:'draft', type:'draft'}, {name:'devis #452256', type:'devis'}, {name:'BT #754877', type:'bt'}], reference: 'ref cli 4', tableau, history:[], historyStep:0},
        {id: 23, versions:[{name:'draft', type:'draft'}],  reference: 'ref cli 774', tableau: tableau2, history:[], historyStep:0},
        {id: 17, versions:[{name:'draft', type:'draft'}, {name:'devis #452244 V1', type:'devis'}, {name:'devis #452244 V2', type:'devis'}, {name:'devis #452244 V3', type:'devis'}],  reference: 'FT44-78', tableau: tableau2, history:[], historyStep:0}
      ] }))
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectTableau} from "../../state/tableau.selector";
import {map, switchMap, takeUntil, tap} from "rxjs/operators";
import {combineLatest, Subject} from "rxjs";
import {SuffrenActions} from "../../state/suffren.action";
import {
  selectCurrentLine,
  selectCurrentLineIndex, selectGrandTotal,
  selectLineDepth, selectSubForms
} from "../../state/suffren.selector";
import {OpportunityActions} from "../../state/opportunity.action";
import {MenuItem} from "primeng/api";
import {ContextMenu} from "primeng/contextmenu";
import {IComponent, ProductType} from "../../model/data/icomponent.model";
import {ComponentManagerService} from "../../services/component-manager.service";
import {RightClickService} from "../../services/right-click.service";
import {selectAllOpportunities, selectCurrentOpportunity} from "../../state/quote.selector";
import {ActivatedRoute, Router} from "@angular/router";
import {QuoteActions} from "../../state/quote.action";

@Component({
  selector: 'app-suffren',
  templateUrl: './suffren.component.html',
  styleUrls: ['./suffren.component.scss']
})
export class SuffrenComponent implements OnInit, OnDestroy{
  @ViewChild('rightClickMenu') rightClickMenu: ContextMenu;
  opportunity$ = this.store.select(selectCurrentOpportunity);
  tableau$ = this.store.select(selectTableau);
  currentLineIndex$ = this.store.select(selectCurrentLineIndex);
  currentLine$ = this.store.select(selectCurrentLine);
  lineDepth$ = this.store.select(selectLineDepth);
  subForms$ = this.store.select(selectSubForms);
  grandTotal$ = this.store.select(selectGrandTotal);
  destroy$ = new Subject();

  sideBarVisible = false;
  sideBar2Visible = false;

  items: MenuItem[];

  constructor(
    private store: Store,
    private componentManager: ComponentManagerService,
    private rightClick: RightClickService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  sideBarClosed(): void {
    this.store.dispatch(SuffrenActions.enterLine({ offset:-1 }))
  }

  selectLine(index: number, enter: boolean=true): void {
    this.store.dispatch(SuffrenActions.selectLine({ lineId:index }))
    if(enter) {
      this.store.dispatch(SuffrenActions.enterLine({ offset:1 }))
    }
  }

  drop(event:any): void {
    this.store.dispatch(OpportunityActions.reorderLine({previous:event.previousIndex, current:event.currentIndex}));
    this.store.dispatch(SuffrenActions.selectLine({ lineId:event.currentIndex }))
  }
  dropComponent(event:any, index: number): void {
    this.store.dispatch(OpportunityActions.reorderComponent({lineIndex: index, previous:event.previousIndex, current:event.currentIndex}));
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      map((data)=>this.store.dispatch(QuoteActions.selectOpportunityById({id:parseInt(data.get('id')??'0')}))),
      switchMap(()=>this.opportunity$),
      tap((opportunity) => {if(!opportunity) {
        this.router.navigate(['/'])
      }})
    ).subscribe()

    this.opportunity$.pipe(
      takeUntil(this.destroy$),
      tap((opportunity)=> {
        if(opportunity) {
          this.store.dispatch(OpportunityActions.loadOpportunity({opportunity}));
        }
      })
    ).subscribe();
    this.tableau$.pipe(
      takeUntil(this.destroy$),
      tap((tableau)=> {
        this.store.dispatch(SuffrenActions.updateTableau({tableau}));
      })
    ).subscribe();

    combineLatest([this.lineDepth$, this.currentLineIndex$]).pipe(
      takeUntil(this.destroy$),
      tap(([lineDepth, lineIndex])=> {
        this.sideBarVisible = lineDepth>=1;
        this.sideBar2Visible = lineDepth>=2;
        if(lineDepth>0) {
          setTimeout(()=>document.getElementById('line-'+(lineIndex-1))?.scrollIntoView(false),10)
        }
      })
    ).subscribe()
  }

  onLinkRightClicked(lineIndex: number|null,componentIndex: number|null, component: IComponent|null, e: any): void {
    if (this.rightClickMenu) {
      if(lineIndex!==null){
        this.selectLine(lineIndex, false)
      }
      this.items = this.rightClick.getItemMenu(lineIndex, componentIndex, component);
      this.rightClickMenu.show(e)
      e.preventDefault()
    }
  }

  toggleComponent(subForm: string, show: boolean) {
    this.store.dispatch(SuffrenActions.openSubForm({key: subForm, display:{show}}))
  }

  editLine(event: any, lineId:number, formKey:string): void {
    this.store.dispatch(SuffrenActions.selectLine({lineId}))
    this.store.dispatch(SuffrenActions.openSubForm({key:formKey, display:{show:true}}))
    event.stopPropagation()
  }

  editComponent(lineId:number, componentId:number, formKey:string, type: string): void {
    this.store.dispatch(SuffrenActions.selectLine({lineId}))
    if(Object.values(ProductType).find((t) => t === type)) {
      this.store.dispatch(SuffrenActions.openSubForm({key:'productForm', display:{show:true}}))
    } else {
      this.store.dispatch(SuffrenActions.selectComponent({componentId:componentId}))
      this.store.dispatch(SuffrenActions.openSubForm({key:formKey, display:{show:true}}))
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

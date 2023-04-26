import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {OpportunityActions, TableauApiActions} from "../../state/opportunity.action";
import {Line} from "../../model/data/line.model";
import {
  selectActiveCell,
  selectCellDefinitions, selectHistory, selectHistoryStep,
  selectTableau
} from "../../state/tableau.selector";
import {DisplayActions} from "../../state/display.action";
import {takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.scss']
})
export class ExcelComponent implements OnInit, OnDestroy{
  @HostListener('document:keydown', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Tab':
        if(event.shiftKey) {
          this.store.dispatch(DisplayActions.moveCell({ offset:-1 }))
        } else {
          this.store.dispatch(DisplayActions.moveCell({ offset:1 }))
        }
        event.preventDefault()
        break;
      case 'ArrowDown':
        this.store.dispatch(DisplayActions.moveLine({ offset:1 }))
        event.preventDefault()
        break;
      case 'ArrowUp':
        this.store.dispatch(DisplayActions.moveLine({ offset:-1 }))
        event.preventDefault()
        break;
      case 'z':
        if(event.ctrlKey) {
          this.store.dispatch(OpportunityActions.rewindHistory({ step:-1 }))
          event.preventDefault()
        }
        break;
      case 'y':
        if(event.ctrlKey) {
          this.store.dispatch(OpportunityActions.rewindHistory({ step:1 }))
          event.preventDefault()
        }
        break;
    }
  }

  tableau$ = this.store.select(selectTableau);
  history$ = this.store.select(selectHistory);
  historyStep$ = this.store.select(selectHistoryStep);
  activeCell$ = this.store.select(selectActiveCell);
  cellDefinitions$ = this.store.select(selectCellDefinitions);
  destroy$ = new Subject();

  addLine(event:any, index: number) {
    const line: Line = {
      id: (index+1).toString(),
      description: '',
      totalPrice: 0,
      totalCost: 0,
      margin: 1,
      unitCost:0, unitPrice:0, quantity:0,
      components:[{
        type:'material',
        description:'test',
        unitPrice:0,
        unitCost:0,
        quantity:0,
        total:0,
        margin:0
      }]
    }
    this.store.dispatch(OpportunityActions.addLine({line, index:null}));
    event.stopPropagation();
  }

  drop(event:any): void {
    this.store.dispatch(OpportunityActions.reorderLine({previous:event.previousIndex, current:event.currentIndex}));
  }

  focusOut(event:any):void {
    this.store.dispatch(DisplayActions.selectLine({ lineId:null }))
    this.store.dispatch(DisplayActions.selectCell({ cellId:null }))
  }

  constructor(private store: Store) {}

  ngOnInit() {
    this.tableau$.pipe(
      takeUntil(this.destroy$),
      tap((tableau)=> {
        this.store.dispatch(DisplayActions.updateTableau({tableau}));
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

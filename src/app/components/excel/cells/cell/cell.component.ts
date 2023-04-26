import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CellDefinition} from "../../../../model/display/cell-definition.model";
import {Line} from "../../../../model/data/line.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {selectActiveCell} from "../../../../state/tableau.selector";
import {debounceTime, Subject} from "rxjs";
import {Store} from "@ngrx/store";
import {filter, takeUntil, tap} from "rxjs/operators";
import {OpportunityActions} from "../../../../state/opportunity.action";
import {ActiveCell} from "../../../../model/display/active-cell.model";

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent  implements OnInit, OnDestroy{
  @Input() cellDefinition: CellDefinition;
  @Input() line: Line;
  @Input() cellIndex: number;
  @Input() lineIndex: number;
  @Input() formGroup: FormGroup;

  activeCell$ = this.store.select(selectActiveCell);
  destroy$ = new Subject();

  constructor(private store: Store, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.autoFocusActiveCell();
  }

  isActiveCell(activeCell:ActiveCell | null): boolean {
    if(!activeCell || !activeCell.lineIndex || ! (activeCell.lineIndex === this.lineIndex && activeCell.cellIndex === this.cellIndex)) {
      return false;
    }
    return true;
  }

  getLineValue(key: string)  {
    return this.formGroup?.get(key)?.value;
  }

  autoFocusActiveCell(): void {
    this.activeCell$.pipe(
      filter((activeCell) => activeCell.lineIndex === this.lineIndex && activeCell.cellIndex=== this.cellIndex),
      debounceTime(1),
      tap(()=> {
        this.focusOnCell()
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  focusOnCell() {
    throw new Error('super.focusOnCell should not be called')
  }

  delete(event:any): void {
    this.store.dispatch(OpportunityActions.removeLine({index: this.lineIndex-1}));
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

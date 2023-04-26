import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {selectActiveCell, selectCellDefinitions} from "../../../state/tableau.selector";
import {Store} from "@ngrx/store";
import {DisplayActions} from "../../../state/display.action";
import {distinctUntilChanged, Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OpportunityActions} from "../../../state/opportunity.action";
import {Line} from "../../../model/data/line.model";
import {ActiveCell} from "../../../model/display/active-cell.model";
import {IComponent, IProduitLong, ProductType} from "../../../model/data/icomponent.model";

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit, OnDestroy{
  @Input() line: Line;
  @Input() lineIndex: number;

  activeCell$ = this.store.select(selectActiveCell);
  cellDefinitions$ = this.store.select(selectCellDefinitions);
  destroy$ = new Subject();
  previousLine: number|null = -1;
  previousCell: number|null = -1;

  lineForm: FormGroup;


  constructor(private store: Store, private fb: FormBuilder) {
  }

  getCellClass(isActive: boolean): string {
    return isActive?"cell cell-selected":"cell";
  }

  isActiveCell(cellId: number, activeCell: ActiveCell | null): boolean {
      if(!activeCell || !activeCell.lineIndex || ! (activeCell.lineIndex === this.lineIndex && activeCell.cellIndex === cellId)) {
        return false;
      }
      return true;
    }

  selectCell(event: any, cellId: number): void {
    this.store.dispatch(DisplayActions.selectCell({cellId}))
    this.store.dispatch(DisplayActions.selectLine({lineId: this.lineIndex}))
  }

  ngOnInit(): void {
    this.autoDispatchLineWhenLeavingCell();
    const materialComponent = this.line.components.find((c) => Object.values(ProductType).find((t)=>t===c.type))
    if(materialComponent) {
      this.lineForm = this.fb.group({
        id:[this.line.id],
        description:[this.line.description],
        grade:[(materialComponent as IProduitLong).grade],
        shape:[(materialComponent as IProduitLong).shape],
        dimensions:[(materialComponent as IProduitLong).dimensions],
        lengthType:[(materialComponent as IProduitLong).lengthType],
        length:[(materialComponent as IProduitLong).length],
        unitPrice:[materialComponent.unitPrice],
        quantity:[materialComponent.quantity],
        totalPrice:[this.line.totalPrice],
        margin:[this.line.margin]
      });
    }
  }

  stopPropagation(event: any) {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  autoDispatchLineWhenLeavingCell(): void {
    this.activeCell$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      tap((activeCell)=> {
        if(this.previousLine===this.lineIndex) {
          if((this.previousCell !== activeCell.cellIndex || this.previousLine !== activeCell.lineIndex) && this.lineForm) {
            const data = this.lineForm.value;
            let newMaterialComponent: IProduitLong = {
              description: "", quantity: data.quantity, total: 0, unitPrice: data.unitPrice,unitCost:2, margin:0,
              type:ProductType.long,
              shape:data.shape,
              grade: data.grade,
              dimensions: data.dimensions,
              length: data.length,
              lengthType: data.lengthType,
            }
            const components: IComponent[] = [newMaterialComponent];
            this.line.components.filter((c)=>c.type!=='material').forEach((c)=>components.push(c))
            let newLine:Line = {
              id: data.id,
              description: '',
              totalPrice: 0,
              totalCost: 0,
              totalDiscount:0,
              margin: data.margin,
              unitCost:0, unitPrice:0, quantity:0,discount:0,
              components
            }
            if(JSON.stringify(newLine)!==JSON.stringify(this.line)) {
              this.store.dispatch(OpportunityActions.updateLine({line:newLine, index: this.lineIndex-1}));
            }
          }
        }
        this.previousLine = activeCell.lineIndex
        this.previousCell = activeCell.cellIndex
      })
    ).subscribe();
  }
}

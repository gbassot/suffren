import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {selectActiveSectionDepth1, selectCurrentLine, selectCurrentLineIndex} from "../../../state/suffren.selector";
import {Store} from "@ngrx/store";
import {FormBuilder, FormGroup} from "@angular/forms";
import {take, takeUntil, tap} from "rxjs/operators";
import {debounceTime, Subject} from "rxjs";
import {Line} from "../../../model/data/line.model";
import {OpportunityActions} from "../../../state/opportunity.action";
import {IComponent, IProduitLong, ProductType} from "../../../model/data/icomponent.model";

@Component({
  selector: 'app-line-form',
  templateUrl: './line-form.component.html',
  styleUrls: ['./line-form.component.scss']
})
export class LineFormComponent implements OnInit, OnDestroy{

  @ViewChild('firstInput') firstInput!: ElementRef;
  @ViewChild('secondInput') secondInput!: ElementRef;

  currentLine$ = this.store.select(selectCurrentLine);
  currentLineIndex$ = this.store.select(selectCurrentLineIndex);
  activeSectionDepth1$ = this.store.select(selectActiveSectionDepth1);
  destroy$ = new Subject();
  formChanged$ = new Subject();

  lineForm: FormGroup;
  constructor(private store: Store, private fb: FormBuilder) {}

  isActive(activeSection: number|null, index: number): boolean {
    return activeSection!==null?index===activeSection:false
  }

  ngOnInit() {
    this.currentLine$.pipe(
      takeUntil(this.destroy$),
      tap((line)=> {
        this.formChanged$.next(true);
        const materialComponent = line?.components.find((c)=>Object.values(ProductType).find((t) => t === c.type))
        if(materialComponent) {
          this.lineForm = this.fb.group({
            id: [line?.id],
            description: [line?.description],
            shape: [(materialComponent as IProduitLong)?.shape],
            grade: [(materialComponent as IProduitLong)?.grade],
            dimensions: [(materialComponent as IProduitLong)?.dimensions],
            lengthType: [(materialComponent as IProduitLong)?.lengthType],
            length: [(materialComponent as IProduitLong)?.length],
            unitPrice: [materialComponent?.unitPrice],
            unitPriceSystem: [materialComponent?.unitPrice],
            quantity: [materialComponent?.quantity],
          });
          this.lineForm.valueChanges.pipe(
            takeUntil(this.formChanged$),
            tap((data) => console.log(data))
          ).subscribe();
        }
      })
    ).subscribe();

    this.activeSectionDepth1$.pipe(
      takeUntil(this.destroy$),
      debounceTime(10),
      tap((section)=> {
        switch (section) {
          case 0:
            this.firstInput?.nativeElement.focus()
            this.firstInput?.nativeElement.select()
            break;
          case 1:
            this.secondInput?.nativeElement.click()
            break
        }
      })
    ).subscribe();
  }

  focusOut(line: Line, index: number): void {
    const data = this.lineForm.value;
    const materialComponent = line.components.find((c) => Object.values(ProductType).find((t) => t === c.type))
    if(materialComponent) {
      const newMaterialComponent = {
        ...materialComponent,
        shape:data.shape,
        dimensions:data.dimensions,
        grade:data.grade,
        length:data.length,
        lengthType:data.lengthType,
        unitPrice:data.unitPrice,
        quantity:data.quantity,
      }
      const components: IComponent[]=[]
      line?.components.forEach((c) => {
        if(c.type==='material') {
          components.push(newMaterialComponent)
        } else {
          components.push(c)
        }
      })

      const newLine = {
        ...line,
        components
      }
      this.store.dispatch(OpportunityActions.updateLine({line:newLine, index:index-1}))
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  options = [
    {
      label:"SL",
      value:"SL"
    },
    {
      label:"FL",
      value:"FL"
    }
  ];
}

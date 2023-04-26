import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {selectActiveSectionDepth1, selectCurrentLine} from "../../../state/suffren.selector";
import {Store} from "@ngrx/store";
import {FormBuilder, FormGroup} from "@angular/forms";
import {take, takeUntil, tap} from "rxjs/operators";
import {debounceTime, Subject} from "rxjs";

@Component({
  selector: 'app-line-form',
  templateUrl: './line-form.component.html',
  styleUrls: ['./line-form.component.scss']
})
export class LineFormComponent implements OnInit, OnDestroy{

  @ViewChild('firstInput') firstInput!: ElementRef;
  @ViewChild('secondInput') secondInput!: ElementRef;

  currentLine$ = this.store.select(selectCurrentLine);
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
        const materialComponent = line?.components.find((c)=>c.type==='material')
        if(materialComponent) {
          this.lineForm = this.fb.group({
            id: [line?.id],
            description: [line?.description],
            shape: [materialComponent?.shape],
            grade: [materialComponent?.grade],
            dimensions: [materialComponent?.dimensions],
            lengthType: [materialComponent?.lengthType],
            length: [materialComponent?.length],
            unitPrice: [materialComponent?.unitPrice],
            unitPriceSystem: [materialComponent?.unitPrice],
            quantity: [materialComponent?.quantity],
          });
          this.lineForm.valueChanges.pipe(
            takeUntil(this.formChanged$),
            tap()
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
            break;
          case 1:
            this.secondInput?.nativeElement.click()
            break
        }
      })
    ).subscribe();
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

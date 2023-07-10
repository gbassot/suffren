import {Component, ElementRef} from '@angular/core';
import {AbstractFormComponent} from "../abstract-form/abstract-form.component";
import {switchMap, take, takeUntil, tap} from "rxjs/operators";
import {FormGroup} from "@angular/forms";
import {Line} from "../../../model/data/line.model";
import {OpportunityActions} from "../../../state/opportunity.action";
import {selectCurrentLineIndex} from "../../../state/suffren.selector";
import {distinctUntilChanged} from "rxjs";
import {InputNumber} from "primeng/inputnumber";

@Component({
  selector: 'app-price-form',
  templateUrl: './price-form.component.html',
  styleUrls: ['./price-form.component.scss']
})
export class PriceFormComponent extends AbstractFormComponent{
  override subFormKey = 'priceForm';
  formGroups: FormGroup[] = [];
  line: Line;

  currentLineIndex$ = this.store.select(selectCurrentLineIndex)
  lastElementId: string = 'unitPrice0';

  override ngOnInit(): void {
    super.ngOnInit()
    this.currentLineIndex$.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((a,b)=>a===b),
      switchMap(() => this.currentLine$),
      tap((line)=> {
        const formGroups:FormGroup[] = [];
        if(line) {
          line.components.forEach((component) => {
            formGroups.push(this.fb.group({unitPrice:component.unitPrice}))
          })
          this.line = line;
        }
        this.formGroups = formGroups;
      })

    ).subscribe()
  }
  focusIn(index:number): void {
    this.lastElementId = 'unitPrice'+index;
  }

  focusOut(line: Line): void {
    this.formGroups.forEach((formGroup, index)=> {
      const oldComponent = line.components[index];
      if(formGroup.get('unitPrice')?.value!==oldComponent.unitPrice){
        const component = {...oldComponent, unitPrice:formGroup.get('unitPrice')?.value}
        this.currentLineIndex$.pipe(take(1), tap((lineIndex) => {
          this.store.dispatch(OpportunityActions.updateComponent({lineIndex, componentIndex:index, component}))
        })).subscribe()
        setTimeout(()=> {
          if(document.getElementById(this.lastElementId)) {
            (document.getElementById(this.lastElementId) as HTMLInputElement).select()
          }
        },1)
      }
    })
  }
  show(): void {
    if(document.getElementById(this.lastElementId)) {
      (document.getElementById(this.lastElementId) as HTMLInputElement).select()
    }
  }
}

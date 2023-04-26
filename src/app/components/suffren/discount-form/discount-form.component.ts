import {Component} from '@angular/core';
import {OpportunityActions} from "../../../state/opportunity.action";
import {takeUntil, tap} from "rxjs/operators";
import {AbstractFormComponent} from "../abstract-form/abstract-form.component";

@Component({
  selector: 'app-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.scss']
})
export class DiscountFormComponent extends AbstractFormComponent{
  override subFormKey = 'discountForm';
  currentDiscount: number;

  override ngOnInit(): void {
    this.currentLine$.pipe(
      takeUntil(this.destroy$),
      tap((line)=> this.currentDiscount = line?.discount??0)
    ).subscribe()
    super.ngOnInit()
  }

  slider(event: any, lineIndex: string) : void {
    const index = parseInt(lineIndex)-1
    if(index>=0) {
      this.store.dispatch(OpportunityActions.updateDiscountLine({discount:event.value??event, index}))
    }
  }
}

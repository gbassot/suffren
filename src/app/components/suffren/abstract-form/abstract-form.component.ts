import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {selectCurrentLine, selectSubForms} from "../../../state/suffren.selector";
import {Store} from "@ngrx/store";
import {takeUntil, tap} from "rxjs/operators";
import {SuffrenActions} from "../../../state/suffren.action";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-abstract-form',
  templateUrl: './abstract-form.component.html',
  styleUrls: ['./abstract-form.component.scss']
})
export class AbstractFormComponent implements OnDestroy, OnInit {


  currentLine$ = this.store.select(selectCurrentLine)
  subForms$ = this.store.select(selectSubForms)
  destroy$ = new Subject()
  visible = false
  subFormKey = '';

  constructor(protected store: Store, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.subForms$.pipe(
      takeUntil(this.destroy$),
      tap((forms)=> {
        const property = this.subFormKey as keyof typeof forms
        this.visible = forms[property].show
      })
    ).subscribe()
  }

  closed(): void {
    this.store.dispatch(SuffrenActions.openSubForm({key:this.subFormKey, display:{show:false}}))
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

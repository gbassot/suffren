import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Store} from "@ngrx/store";
import {selectAllOpportunities} from "../../state/quote.selector";
import {QuoteActions} from "../../state/quote.action";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  opportunities$ = this.store.select(selectAllOpportunities);
  destroy$ = new Subject();
  constructor(
    private store: Store,
    private router: Router
  ) {}

  selectOpportunity(index: number): void {
    this.store.dispatch(QuoteActions.selectOpportunity({index}))
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

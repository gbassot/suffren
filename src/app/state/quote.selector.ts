import { createSelector, createFeatureSelector } from '@ngrx/store';
import {QuoteState} from "../model/state/quote-state.model";

export const selectQuote = createFeatureSelector<QuoteState>('quote');

export const selectAllOpportunities = createSelector(
  selectQuote,
  (quote) => {
    return quote.opportunities;
  }
);

export const selectCurrentOpportunity = createSelector(
  selectQuote,
  (quote) => {
    return quote.opportunities[quote.activeOpportunity]??null;
  }
);





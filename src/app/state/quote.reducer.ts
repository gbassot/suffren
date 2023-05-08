import { createReducer, on } from '@ngrx/store';
import {OpportunityActions} from "./opportunity.action";
import {SuffrenState} from "../model/state/suffren-state.model";
import {SuffrenActions} from "./suffren.action";
import {QuoteState} from "../model/state/quote-state.model";
import {QuoteActions} from "./quote.action";

export const initialState: QuoteState = {
  activeOpportunity: 0,
  opportunities: []
};

export const quoteReducer = createReducer(
  initialState,
  on(QuoteActions.loadOpportunities, (_state, { opportunities }) =>{
    return {..._state, opportunities};
  }),

  on(QuoteActions.selectOpportunity, (_state, { index }) =>{
    return {..._state, activeOpportunity: index};
  }),
);

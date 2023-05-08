import { createActionGroup, props } from '@ngrx/store';
import {Opportunity} from "../model/data/opportunity.model";


export const QuoteActions = createActionGroup({
  source: 'Quote',
  events: {
    'Load Opportunities': props<{ opportunities: Opportunity[] }>(),
    'Select Opportunity': props<{ index: number }>(),
  },
});


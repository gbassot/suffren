import { createSelector, createFeatureSelector } from '@ngrx/store';
import {Opportunity} from "../model/state/opportunity.model";
import {DisplayState} from "../model/state/display-state.model";
import {ActiveCell} from "../model/display/active-cell.model";

export const selectOpportunity = createFeatureSelector<Opportunity>('opportunity');
export const selectTableau = createSelector(selectOpportunity, (opportunity) => opportunity.tableau);
export const selectHistory = createSelector(selectOpportunity, (opportunity) => opportunity.history);
export const selectHistoryStep = createSelector(selectOpportunity, (opportunity) => opportunity.historyStep);
export const selectDisplay = createFeatureSelector<DisplayState>('display');
export const selectActiveCell = createSelector(
  selectDisplay,
  (display) => {
    return {
      lineIndex:display.selectedLine,
      cellIndex:display.selectedCell
    } as ActiveCell;
  }
);

export const selectCellDefinitions = createSelector(
  selectDisplay,
  (display) => {
    return display.cellDefinitions;
  }
);



import { createSelector, createFeatureSelector } from '@ngrx/store';
import {Opportunity} from "../model/state/opportunity.model";
import {DisplayState} from "../model/state/display-state.model";
import {ActiveCell} from "../model/display/active-cell.model";
import {SuffrenState} from "../model/state/suffren-state.model";

export const selectOpportunity = createFeatureSelector<Opportunity>('opportunity');
export const selectSuffren = createFeatureSelector<SuffrenState>('suffren');

export const selectCurrentLineIndex = createSelector(
  selectSuffren,
  (suffren) => {
    return suffren.selectedLine;
  }
);

export const selectLineEntered = createSelector(
  selectSuffren,
  (suffren) => {
    return suffren.lineDepth;
  }
);


export const selectCurrentLine = createSelector(
  selectSuffren,
  (state) => {
    return state.selectedLine!==null?state.tableau[state.selectedLine]:null;
  }
);

export const selectActiveSectionDepth1 = createSelector(
  selectSuffren,
  (suffren) => {
    return suffren.activeSectionDepth1;
  }
);

export const selectExpandComponent = createSelector(
  selectSuffren,
  (suffren) => {
    return suffren.expandComponent;
  }
);

export const selectGrandTotal = createSelector(
  selectSuffren,
  (suffren) => {
    let totalPrice = 0;
    let totalCost = 0;
    suffren.tableau.forEach((line) => {
      totalPrice += line.totalPrice
      totalCost += line.totalCost
    });
    return {totalPrice, totalCost, margin: Math.round((totalPrice-totalCost)/totalCost*100)};
  }
);






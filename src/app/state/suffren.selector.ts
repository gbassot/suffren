import { createSelector, createFeatureSelector } from '@ngrx/store';
import {SuffrenState} from "../model/state/suffren-state.model";

export const selectSuffren = createFeatureSelector<SuffrenState>('suffren');

export const selectCurrentLineIndex = createSelector(
  selectSuffren,
  (suffren) => {
    return (suffren.main.selectedLine??-1);
  }
);

export const selectLineDepth = createSelector(
  selectSuffren,
  (suffren) => {
    return suffren.main.lineDepth;
  }
);


export const selectCurrentLine = createSelector(
  selectSuffren,
  (state) => {
    return state.main.selectedLine!==null?state.tableau[state.main.selectedLine]:null;
  }
);

export const selectCurrentComponent = createSelector(
  selectSuffren,
  (state) => {
    return state.main.selectedLine!==null && state.main.selectedComponent!==null?
      (state.tableau[state.main.selectedLine].components[state.main.selectedComponent]??null)
      :null;
  }
);

export const selectActiveSectionDepth1 = createSelector(
  selectSuffren,
  (suffren) => {
    return suffren.main.activeSectionDepth1;
  }
);

export const selectSubForms = createSelector(
  selectSuffren,
  (suffren) => {
    return suffren.subForms;
  }
);

export const selectAnyFormOpened = createSelector(
  selectSuffren,
  (suffren) => {
    return (
      suffren.subForms.discountForm.show ||
      suffren.subForms.productForm.show ||
      suffren.subForms.priceForm.show ||
      suffren.subForms.productSelectorForm.show ||
      suffren.subForms.commentForm.show ||
      suffren.subForms.commercialForm.show ||
      suffren.subForms.productionForm.show
    )
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






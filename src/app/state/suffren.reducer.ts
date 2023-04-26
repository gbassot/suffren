import { createReducer, on } from '@ngrx/store';
import {OpportunityActions} from "./opportunity.action";
import {SuffrenState} from "../model/state/suffren-state.model";
import {SuffrenActions} from "./suffren.action";

export const initialState: SuffrenState = {
  activeSectionDepth1: 0,
  tableau: [],
  selectedLine: null,
  lineDepth: 0,
  expandComponent:true,
};

export const suffrenReducer = createReducer(
  initialState,
  on(SuffrenActions.updateTableau, (_state, { tableau }) =>{
    return {..._state, tableau};
  }),
  on(SuffrenActions.selectLine, (_state, { lineId }) => {
    return {..._state, selectedLine:lineId};
  }),
  on(SuffrenActions.enterLine, (_state, { offset }) => {
    let newDepth =_state.lineDepth + offset;
    if(newDepth<0) {
      newDepth = 0
    }
    if(newDepth>2) {
      newDepth = 2
    }
    if(_state.selectedLine=== null) {
      newDepth = 0
    }
    return {..._state, lineDepth:newDepth};
  }),

  on(SuffrenActions.moveLine, (_state, { offset }) => {
    let lineId = _state.selectedLine??-1;
    lineId += offset;
    if(lineId<0) {
      lineId=0
    }
    if(lineId>=_state.tableau.length) {
      lineId=_state.tableau.length-1
    }
    return {..._state, selectedLine:lineId};
  }),
  on(OpportunityActions.addLine, (_state, { line, index }) => {
    return {..._state, selectedLine: index!==null?index+1:_state.tableau.length, lineDepth: 1};
  }),
  on(SuffrenActions.moveSection, (_state, { offset }) => {
    let section = _state.activeSectionDepth1??-1;
    section += offset;
    if(section<0) {
      section=0
    }
    if(section>=4) {
      section=4
    }
    return {..._state, activeSectionDepth1:section};
  }),
  on(SuffrenActions.toggleExpandComponent, (_state, { bool }) => {
    return {..._state, expandComponent: bool};
  }),
);

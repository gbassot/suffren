import { createReducer, on } from '@ngrx/store';
import {OpportunityActions} from "./opportunity.action";
import {SuffrenState} from "../model/state/suffren-state.model";
import {SuffrenActions} from "./suffren.action";

export const initialState: SuffrenState = {
  tableau: [],
  main:{
    activeSectionDepth1: 0,
    selectedLine: 0,
    selectedComponent: null,
    lineDepth: 0,
  },
  subForms: {
    discountForm: {show:false},
    priceForm: {show:false},
    productForm: {show:false},
    productSelectorForm: {show:false},
    serviceForm: {show:false},
    commentForm: {show:false},
    productionForm: {show:false},
    commercialForm: {show:false},
    showComments: {show:false},
    showComponents: {show:true},
    showHelp: {show:false},
  },
  subFormOpenOrder:[],
};

export const suffrenReducer = createReducer(
  initialState,
  on(SuffrenActions.updateTableau, (_state, { tableau }) =>{
    return {..._state, tableau};
  }),
  on(SuffrenActions.selectLine, (_state, { lineId }) => {
    return {..._state,main: {..._state.main, selectedLine:lineId}};
  }),
  on(SuffrenActions.selectComponent, (_state, { componentId }) => {
    return {..._state,main: {..._state.main, selectedComponent:componentId}};
  }),
  on(SuffrenActions.enterLine, (_state, { offset }) => {
    let newDepth =_state.main.lineDepth + offset;
    if(newDepth<0) {
      newDepth = 0
    }
    if(newDepth>2) {
      newDepth = 2
    }
    if(_state.main.selectedLine=== null) {
      newDepth = 0
    }
    return {..._state, main: {..._state.main, lineDepth:newDepth}};
  }),

  on(SuffrenActions.moveLine, (_state, { offset }) => {
    let lineId = _state.main.selectedLine??-1;
    lineId += offset;
    if(lineId<0) {
      lineId=0
    }
    if(lineId>=_state.tableau.length) {
      lineId=_state.tableau.length-1
    }
    return {..._state, main: {..._state.main, selectedLine:lineId}};
  }),
  on(OpportunityActions.addLine, (_state, { index }) => {
    return {..._state, main:{..._state.main, selectedLine: index!==null && index!==-1?(index+1):_state.tableau.length}};
  }),
  on(OpportunityActions.copyLine, (_state, { index }) => {
    return {..._state, main:{..._state.main, selectedLine: index+1}};
  }),
  on(OpportunityActions.removeLine, (_state, { index }) => {
    let selectedLine = index!==null && index >= _state.tableau.length-1?_state.tableau.length-2:_state.main.selectedLine;
    let lineDepth = _state.main.lineDepth
    if(selectedLine!== null && selectedLine<0) {
      selectedLine=null;
      lineDepth=0
    }

    return {..._state, main: {..._state.main, selectedLine, lineDepth}};
  }),
  on(SuffrenActions.moveSection, (_state, { offset }) => {
    let section = _state.main.activeSectionDepth1??-1;
    section += offset;
    if(section<0) {
      section=0
    }
    if(section>=4) {
      section=4
    }
    return {..._state, main:{..._state.main,activeSectionDepth1:section}};
  }),
  on(SuffrenActions.expandComponent, (_state, { bool }) => {
    return {..._state, main:{..._state.main, expandComponent:bool}};
  }),
  on(SuffrenActions.showHelp, (_state, { bool }) => {
    return {..._state, main:{..._state.main, showHelp:bool}};
  }),
  on(SuffrenActions.openSubForm, (_state, { key, display }) => {
    const subForms = {..._state.subForms}
    let property = key as keyof typeof subForms;
    subForms[property] = display;
    const newOrder = [..._state.subFormOpenOrder]
    if(display.show && !_state.subFormOpenOrder.find((subForm)=> subForm === key)) {
      newOrder.push(key);
    }
    return {..._state, subForms, subFormOpenOrder: newOrder};
  }),
  on(SuffrenActions.escapePressed, (_state, { bool }) => {
    if(_state.subFormOpenOrder.length===0) {
      return _state;
    }
    let newOrder = [..._state.subFormOpenOrder]
    const lastOrder = newOrder.pop();
    const subForms = {..._state.subForms}
    let property = lastOrder as keyof typeof subForms;
    subForms[property] = {show:false};
    return {..._state, subForms, subFormOpenOrder: newOrder};
  }),
);

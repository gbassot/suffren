import { createReducer, on } from '@ngrx/store';
import {OpportunityActions} from "./opportunity.action";
import {Opportunity} from "../model/data/opportunity.model";
import {Line} from "../model/data/line.model";
import {OpportunityCompute} from "./opportunity.compute";


export const initialState: Opportunity = {
  reference:'',
  id:0,
  versions:[],
  tableau:[],
  history:[],
  historyStep:0
};

export const opportunityReducer = createReducer(
  initialState,
  on(OpportunityActions.loadOpportunity, (_state, { opportunity }) =>{
    const tableau = opportunity.tableau.map((line,index)=>OpportunityCompute.calculateLine(line, index))
    return {..._state, tableau};
  }),
  on(OpportunityActions.reorderLine, (_state, { previous, current }) => {
    if(previous==current) {
      return _state;
    }
    const oldTableau = [..._state.tableau];
    let lineNumber=1;
    const newTableau = [];
    for(let i=0;i<oldTableau.length;i++) {
      if(i==previous) {
        continue;
      }
      if(previous<current) {
        newTableau.push({...oldTableau[i], id: `${lineNumber++}`});
      }
      if(i==current) {
        newTableau.push({...oldTableau[previous], id: `${lineNumber++}`});
      }
      if(previous>=current) {
        newTableau.push({...oldTableau[i], id: `${lineNumber++}`});
      }
    }
    return {..._state, tableau: newTableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.addLine, (_state, { index }) => {
    const line: Line = {
      id: '0',
      description: '',
      totalPrice: 0,
      totalCost: 0,
      totalDiscount:0,
      unitCost:0, unitPrice:0, quantity:0,discount:0,
      components:[]
    }
    let tableau = [..._state.tableau];
    if(index === -1) {
      tableau.push(OpportunityCompute.calculateLine(line,_state.tableau.length));
    } else {
      const newTableau:Line[] = [];
      let lineNumber=1

      _state.tableau.forEach((l, i)=>{
        newTableau.push({...l, id:`${lineNumber++}`})
        if(index===i) {
          newTableau.push(OpportunityCompute.calculateLine(line,index+1))
        }
      })
      if(index===_state.tableau.length) {
        newTableau.push(OpportunityCompute.calculateLine(line,index+1))
      }
      tableau = newTableau
      tableau = tableau.map((line, index)=>OpportunityCompute.calculateLine(line,index))
    }
    return {..._state, tableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.removeLine, (_state, { index }) => {
    let tableau = [..._state.tableau];
    tableau.splice(index,1);
    tableau = tableau.map((line, index)=>OpportunityCompute.calculateLine(line,index))
    return {..._state, tableau: tableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.copyLine, (_state, { index }) => {
    const tableau = [..._state.tableau];
    const newTableau:Line[] = [];
    let lineNumber=1
    _state.tableau.forEach((line, i)=>{
      newTableau.push({...line, id:`${lineNumber++}`})
      if(index===i) {
        newTableau.push({...tableau[index], id:`${lineNumber++}`})
      }
    })
    return {..._state, tableau:newTableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),

  on(OpportunityActions.rewindHistory, (_state, { step }) => {
    const newStep = _state.historyStep+step;
    if(!_state.history[newStep]) {
      return _state;
    }
    const tableau = _state.history[newStep].tableau;
    if(_state.historyStep>=_state.history.length) {
      const history = OpportunityCompute.addToHistory(_state)
      return {..._state, tableau,history, historyStep: newStep};
    } else {
      return {..._state, tableau, historyStep: newStep};
    }
  }),
  on(OpportunityActions.addComponent, (_state, { lineIndex, component }) => {
    const tableau = [..._state.tableau];
    const newTableau = [..._state.tableau[lineIndex].components];
    newTableau.push(component)
    tableau[lineIndex] = OpportunityCompute.calculateLine({...tableau[lineIndex], components: newTableau},lineIndex);
    return {..._state, tableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.removeComponent, (_state, { lineIndex, index }) => {
    let tableau = [..._state.tableau];
    const newTableau = [..._state.tableau[lineIndex].components];
    newTableau.splice(index,1);
    tableau[lineIndex] = tableau[lineIndex] = {...tableau[lineIndex], components: newTableau} ;
    tableau = tableau.map((line, index)=>OpportunityCompute.calculateLine(line,index))
    return {..._state, tableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),

  on(OpportunityActions.updateLine, (_state, { line, index }) => {
    const tableau = [..._state.tableau];
    line = OpportunityCompute.calculateLine(line, index)
    tableau[index] = line;
    return {..._state, tableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.updateComponent, (_state, { lineIndex, componentIndex, component}) => {
    const tableau = [..._state.tableau];
    let line = {...tableau[lineIndex]};
    const components = [...line.components];
    components[componentIndex] = component
    line = {...line, components}
    line = OpportunityCompute.calculateLine(line, lineIndex)
    tableau[ lineIndex] = line;
    return {..._state, tableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.updateDiscountLine, (_state, { discount, index }) => {
    const tableau = [..._state.tableau];
    let line = {...tableau[index], discount};
    line = OpportunityCompute.calculateLine(line, index)
    tableau[ index] = line;
    return {..._state, tableau};
  }),
  on(OpportunityActions.reorderComponent, (_state, { lineIndex, previous, current }) => {
    if(previous==current) {
      return _state;
    }
    const oldTableau = [..._state.tableau[lineIndex].components];
    const newTableau = [];
    for(let i=0;i<oldTableau.length;i++) {
      if(i==previous) {
        continue;
      }
      if(previous<current) {
        newTableau.push(oldTableau[i]);
      }
      if(i==current) {
        newTableau.push(oldTableau[previous]);
      }
      if(previous>=current) {
        newTableau.push(oldTableau[i]);
      }
    }
    const tableau = [..._state.tableau];
    tableau[lineIndex] = {...tableau[lineIndex], components: newTableau} ;
    return {..._state, tableau: tableau, history:OpportunityCompute.addToHistory(_state), historyStep:_state.historyStep+1};
  }),
);

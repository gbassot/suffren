import { createReducer, on } from '@ngrx/store';
import {OpportunityActions, TableauApiActions} from "./opportunity.action";
import {Opportunity} from "../model/state/opportunity.model";
import {Line} from "../model/data/line.model";
import {IComponent} from "../model/data/icomponent.model";


export const initialState: Opportunity = {
  tableau:[],
  history:[],
  historyStep:0
};

export const opportunityReducer = createReducer(
  initialState,
  on(TableauApiActions.retrievedTableauList, (_state, { tableau }) =>{
    tableau = tableau.map((line,index)=>calculateLine(line, index))
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
    return {..._state, tableau: newTableau, history:addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.addLine, (_state, { line, index }) => {
    let tableau = [..._state.tableau];
    if(index === null) {
      tableau.push(calculateLine(line,_state.tableau.length));
    } else {
      const newTableau:Line[] = [];
      let lineNumber=1
      _state.tableau.forEach((l, i)=>{
        newTableau.push({...l, id:`${lineNumber++}`})
        if(index===i) {
          newTableau.push(calculateLine(line,index+1))
        }
      })
      tableau = newTableau
      tableau = tableau.map((line, index)=>calculateLine(line,index))
    }
    return {..._state, tableau, history:addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.removeLine, (_state, { index }) => {
    let tableau = [..._state.tableau];
    tableau.splice(index,1);
    tableau = tableau.map((line, index)=>calculateLine(line,index))
    return {..._state, tableau: tableau, history:addToHistory(_state), historyStep:_state.historyStep+1};
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
    return {..._state, tableau:newTableau, history:addToHistory(_state), historyStep:_state.historyStep+1};
  }),

  on(OpportunityActions.rewindHistory, (_state, { step }) => {
    const newStep = _state.historyStep+step;
    if(!_state.history[newStep]) {
      return _state;
    }
    const tableau = _state.history[newStep].tableau;
    if(_state.historyStep>=_state.history.length) {
      const history = addToHistory(_state)
      return {..._state, tableau,history, historyStep: newStep};
    } else {
      return {..._state, tableau, historyStep: newStep};
    }
  }),
  on(OpportunityActions.addComponent, (_state, { lineIndex, component }) => {
    const tableau = [..._state.tableau];
    const newTableau = [..._state.tableau[lineIndex].components];
    newTableau.push(component)
    tableau[lineIndex] = calculateLine({...tableau[lineIndex], components: newTableau},lineIndex);
    return {..._state, tableau, history:addToHistory(_state), historyStep:_state.historyStep+1};
  }),
  on(OpportunityActions.removeComponent, (_state, { lineIndex, index }) => {
    let tableau = [..._state.tableau];
    const newTableau = [..._state.tableau[lineIndex].components];
    newTableau.splice(index-1,1);
    tableau[lineIndex] = tableau[lineIndex] = {...tableau[lineIndex], components: newTableau} ;
    tableau = tableau.map((line, index)=>calculateLine(line,index))
    return {..._state, tableau, history:addToHistory(_state), historyStep:_state.historyStep+1};
  }),

  on(OpportunityActions.updateLine, (_state, { line, index }) => {
    const tableau = [..._state.tableau];
    line = calculateLine(line, index)

    if(JSON.stringify(line)===JSON.stringify(tableau[ index-1])) {
      return _state;
    }
    tableau[ index-1] = line;
    return {..._state, tableau, history:addToHistory(_state), historyStep:_state.historyStep+1};
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
    return {..._state, tableau: tableau, history:addToHistory(_state), historyStep:_state.historyStep+1};
  }),
);

function addToHistory(state:Opportunity): ReadonlyArray<Opportunity> {
  const newHistory = [...state.history];
  newHistory.splice(state.historyStep)
  newHistory.push({tableau : state.tableau, history:[], historyStep:-1});
  return newHistory;
}

function calculateLine(line:Line, index:number): Line {
  const materialComponent = line.components.find((c)=>c.type==='material')
  let description = 'non résolu'
  if(materialComponent) {
    let name = materialComponent.shape;
    if (name === 'NBR') {
      name = 'Barre ronde'
    }
    description = `${name} ${materialComponent.dimensions}, ${materialComponent.grade}`
    if(name==undefined) {
      description = 'Ligne en cours de création...'
    }
  }

  const components = line.components.map((component) => calculateComponent(component))
  let totalCost= 0
  let totalPrice= 0
  let quantity= 0
  let warning: string|undefined
  components.forEach((component)=> {
    totalCost+=component.quantity*component.unitCost
    totalPrice+=component.total
    if(component.type==='material') {
      quantity = component.quantity
    }
    if(component.type==='service' && component.description==='Découpe' && component.total==0) {
      warning='Découpe offerte'
    }
  })

  return {...line,
    id:`${index+1}`,
    totalPrice,
    totalCost,
    margin:Math.round((totalPrice-totalCost)/totalCost*100),
    quantity,
    unitPrice:totalPrice/quantity,
    unitCost:totalCost/quantity,
    description,
    components,
    warning
  };
}

function calculateComponent(component:IComponent): IComponent {
  let description='';
  switch (component.type) {
    case 'service':
      description = `${component.description}`;
      break;
    case 'material':
      description = `${component.shape} ${component.dimensions}, ${component.grade}`
      if(component.shape === undefined) {
        description = ''
      }

  }
  const total = Math.round(component.unitPrice * component.quantity *100)/100;
  return {...component,total, description, margin: Math.round((component.unitPrice-component.unitCost)/component.unitCost*100)};
}


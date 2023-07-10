import { createReducer, on } from '@ngrx/store';
import {DisplayActions} from "./display.action";
import {DisplayState} from "../model/state/display-state.model";
import {OpportunityActions} from "./opportunity.action";
import {Line} from "../model/data/line.model";


export const initialState: DisplayState = {
    tableau: [],
    selectedCell: null,
    selectedLine: null,
    cellDefinitions: [
      {
        type:'text',
        formControlName:'id',
        readOnly:true,
        width:130,
        minWidth:10,
        title: 'id'
      },
      {
        type:'autocomplete',
        formControlName:'grade',
        readOnly:false,
        width:130,
        minWidth:10,
        title: 'Nuance'
      },
      {
        type:'input',
        formControlName:'shape',
        readOnly:false,
        width:130,
        minWidth:10,
        title: 'Forme'
      },
      {
        type:'input',
        formControlName:'dimensions',
        readOnly:false,
        width:130,
        minWidth:10,
        title: 'Dimensions'
      },
      {
        type:'dropdown',
        formControlName:'lengthType',
        readOnly:false,
        width:130,
        minWidth:100,
        title: 'Type'
      },
      {
        type:'input',
        formControlName:'length',
        readOnly:false,
        width:130,
        minWidth:10,
        title: 'Longueur'
      },
      {
        type:'input',
        formControlName:'unitPrice',
        readOnly:false,
        width:130,
        minWidth:10,
        title: 'Prix unitaire'
      },
      {
        type:'input',
        formControlName:'quantity',
        readOnly:false,
        width:130,
        minWidth:10,
        title: 'Quantité'
      },
      {
        type:'text',
        formControlName:'totalPrice',
        readOnly:true,
        width:130,
        minWidth:10,
        title: 'Total'
      },
    ]
};

export const displayReducer = createReducer(
  initialState,
  on(DisplayActions.updateTableau, (_state, { tableau }) =>{
    let cellDefinitions = [..._state.cellDefinitions];
    cellDefinitions = cellDefinitions.map((cellDefinition)=> {
      const title = getTextWidth(cellDefinition.title ,'400 1rem system-ui')
      let width = Math.max(cellDefinition.minWidth, title, ...tableau.map((line) => {
        let value= line[cellDefinition.formControlName as keyof Line] as string;
        if(value === undefined) {
          return 0;
        }
        return getTextWidth(value,'400 1rem system-ui')
      }))
      width = width + 20;
      return {...cellDefinition, width};
    })
    return {..._state, tableau, cellDefinitions};
  }),
  on(DisplayActions.selectCell, (_state, { cellId }) => {
    return {..._state, selectedCell:cellId};
  }),
  on(DisplayActions.selectLine, (_state, { lineId }) => {
    return {..._state, selectedLine:lineId};
  }),
  on(DisplayActions.moveCell, (_state, { offset }) => {
    const numberOfCells = _state.cellDefinitions.length;
    let cellId = _state.selectedCell??1;
    let lineId = _state.selectedLine??1;
    let cpt = 0;
    do {
      cellId += offset;
      if(cellId<1) {
        if(lineId>1) {
          cellId=numberOfCells
          lineId--;
        } else {
          cellId=1;
        }
      }
      if(cellId>numberOfCells) {
        if(lineId<_state.tableau.length) {
          cellId=1;
          lineId++;
        } else {
          cellId=numberOfCells;
        }
      }
      cpt++;
    } while (_state.cellDefinitions[cellId-1]?.readOnly && cpt<5);
    if(cpt>=5) {
      //cancel
      return _state;
    }

    return {..._state, selectedCell:cellId, selectedLine:lineId};
  }),

  on(DisplayActions.moveLine, (_state, { offset }) => {
    if([2,5].find((e)=>e===_state.selectedCell)) { //select field
      return _state;
    }
    let lineId = _state.selectedLine??1;
    lineId += offset;
    if(lineId<1) {
      lineId=1
    }
    if(lineId>_state.tableau.length) {
      lineId=_state.tableau.length
    }
    return {..._state, selectedLine:lineId};
  }),
  on(OpportunityActions.addLine, (_state, { index }) => {
    return {..._state, selectedCell:2, selectedLine: _state.tableau.length+1};
  }),
);

function getTextWidth(text: string, font: string):number {
  // re-use canvas object for better performance
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if(context) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  canvas.remove()
  return 100;
}

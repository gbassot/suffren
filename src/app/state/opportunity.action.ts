import { createActionGroup, props } from '@ngrx/store';
import {Line} from "../model/data/line.model";
import {IComponent} from "../model/data/icomponent.model";


export const OpportunityActions = createActionGroup({
  source: 'Tableau',
  events: {
    'Add Line': props<{ line: Line, index:number|null }>(),
    'Remove Line': props<{ index: number }>(),
    'Copy Line': props<{ index: number }>(),
    'Update Line': props<{ line: Line, index:number }>(),
    'Remove Line Component': props<{ line: Line, index:number }>(),
    'Reorder Line': props<{ previous: number; current: number }>(),
    'Add Component': props<{ lineIndex: number, component: IComponent }>(),
    'Remove Component': props<{ lineIndex: number, index:number }>(),
    'Update Component': props<{ lineIndex: number, component:IComponent }>(),
    'Reorder Component': props<{ lineIndex: number, previous: number; current: number }>(),
    'Rewind History': props<{ step: number }>(),
  },
});

export const TableauApiActions = createActionGroup({
  source: 'Tableau API',
  events: {
    'Retrieved Tableau List': props<{ tableau: ReadonlyArray<Line> }>(),
  },
});
import { createActionGroup, props } from '@ngrx/store';
import {Line} from "../model/data/line.model";
import {IComponent} from "../model/data/icomponent.model";
import {Opportunity} from "../model/data/opportunity.model";


export const OpportunityActions = createActionGroup({
  source: 'Tableau',
  events: {
    'Load Opportunity': props<{ opportunity: Opportunity }>(),
    'Add Line': props<{ index:number|null }>(),
    'Remove Line': props<{ index: number }>(),
    'Copy Line': props<{ index: number }>(),
    'Update Line': props<{ line: Line, index:number }>(),
    'Remove Line Component': props<{ line: Line, index:number }>(),
    'Reorder Line': props<{ previous: number; current: number }>(),
    'Add Component': props<{ lineIndex: number, component: IComponent }>(),
    'Remove Component': props<{ lineIndex: number, index:number }>(),
    'Update Component': props<{ lineIndex: number, componentIndex: number, component:IComponent }>(),
    'Reorder Component': props<{ lineIndex: number, previous: number; current: number }>(),
    'Rewind History': props<{ step: number }>(),
    'Update Discount Line': props<{ discount: number, index:number }>(),
  },
});

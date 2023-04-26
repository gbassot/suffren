import { createActionGroup, props } from '@ngrx/store';
import {Line} from "../model/data/line.model";


export const DisplayActions = createActionGroup({
  source: 'Display',
  events: {
    'Select Cell': props<{ cellId: number|null }>(),
    'Select Line': props<{ lineId: number|null }>(),
    'Move Line': props<{ offset: number }>(),
    'Move Cell': props<{ offset: number }>(),
    'Update Tableau': props<{ tableau: ReadonlyArray<Line> }>(),
  },
});

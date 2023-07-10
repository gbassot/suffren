import { createActionGroup, props } from '@ngrx/store';
import {Line} from "../model/data/line.model";
import {Display} from "../model/state/suffren-state.model";


export const SuffrenActions = createActionGroup({
  source: 'Suffren',
  events: {
    'Select Line': props<{ lineId: number|null }>(),
    'Select Component': props<{ componentId: number|null }>(),
    'Move Line': props<{ offset: number }>(),
    'Enter Line': props<{ offset: number }>(),
    'Move Section': props<{ offset: number }>(),
    'Update Tableau': props<{ tableau: ReadonlyArray<Line> }>(),
    'Expand Component': props<{ bool: boolean }>(),
    'Show Help': props<{ bool: boolean }>(),
    'Open Sub Form': props<{ key:string, display: Display }>(),
    'Escape Pressed': props<{ bool:boolean }>(),
  },
});


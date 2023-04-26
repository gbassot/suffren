import { createActionGroup, props } from '@ngrx/store';
import {Line} from "../model/data/line.model";


export const SuffrenActions = createActionGroup({
  source: 'Suffren',
  events: {
    'Select Line': props<{ lineId: number|null }>(),
    'Move Line': props<{ offset: number }>(),
    'Enter Line': props<{ offset: number }>(),
    'Move Section': props<{ offset: number }>(),
    'Update Tableau': props<{ tableau: ReadonlyArray<Line> }>(),
    'Toggle Expand Component': props<{ bool: boolean }>(),
  },
});

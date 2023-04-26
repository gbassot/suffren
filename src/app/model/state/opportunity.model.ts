import {Line} from "../data/line.model";

export interface Opportunity {
  tableau: ReadonlyArray<Line>;
  history: ReadonlyArray<Opportunity>
  historyStep: number
}

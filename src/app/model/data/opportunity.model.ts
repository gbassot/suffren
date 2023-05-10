import {Line} from "../data/line.model";

export interface Opportunity {
  id:number,
  reference: string,
  lastUpdate: string,
  versions: Version[],
  tableau: ReadonlyArray<Line>;
  history: ReadonlyArray<Opportunity>
  historyStep: number
}

export interface Version {
  name: string;
  type: string;
}

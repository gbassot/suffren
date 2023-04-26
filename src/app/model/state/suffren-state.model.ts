import {Line} from "../data/line.model";

export class SuffrenState {

  tableau: ReadonlyArray<Line>;
  selectedLine: number|null;
  lineDepth: number;
  activeSectionDepth1: number;
  expandComponent: boolean;
}

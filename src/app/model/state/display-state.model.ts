import {Line} from "../data/line.model";
import {CellDefinition} from "../display/cell-definition.model";

export interface DisplayState {
  tableau: ReadonlyArray<Line>;
  selectedLine: number|null;
  selectedCell: number|null;
  cellDefinitions: ReadonlyArray<CellDefinition>;
}

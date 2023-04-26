import {Component, ViewChild} from '@angular/core';
import {CellComponent} from "../cell/cell.component";
import {AutoComplete} from "primeng/autocomplete";

@Component({
  selector: 'app-cell-autocomplete',
  templateUrl: './cell-autocomplete.component.html',
  styleUrls: ['./cell-autocomplete.component.scss']
})
export class CellAutocompleteComponent extends CellComponent {
  @ViewChild('cell') cell!: AutoComplete;

  suggestions: Array<string> =[];

  override focusOnCell() {
    this.cell?.focusInput()
  }

  searchShape(event: any) {
    this.suggestions = ['NBR', 'NTL', 'NDD'].filter((f) => f.toLowerCase().indexOf(event.query.toLowerCase())!==-1);
  }
}

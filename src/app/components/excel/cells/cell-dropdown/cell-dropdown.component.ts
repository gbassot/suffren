import {Component, ElementRef, ViewChild} from '@angular/core';
import {CellComponent} from "../cell/cell.component";
import {Dropdown} from "primeng/dropdown";

@Component({
  selector: 'app-cell-dropdown',
  templateUrl: './cell-dropdown.component.html',
  styleUrls: ['./cell-dropdown.component.scss']
})
export class CellDropdownComponent extends CellComponent {
  @ViewChild('cell') cell!: Dropdown;

  options = [
    {
      label:"SL",
      value:"SL"
    },
    {
      label:"FL",
      value:"FL"
    }
  ];

  override focusOnCell() {
    this.cell?.focus()
    this.cell?.show()
  }
}

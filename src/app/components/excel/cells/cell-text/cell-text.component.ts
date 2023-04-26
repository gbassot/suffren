import {Component, ElementRef, ViewChild} from '@angular/core';
import {CellComponent} from "../cell/cell.component";

@Component({
  selector: 'app-cell-text',
  templateUrl: './cell-text.component.html',
  styleUrls: ['./cell-text.component.scss']
})
export class CellTextComponent extends CellComponent {
  @ViewChild('cell') cell!: ElementRef;

  override focusOnCell() {

  }
}

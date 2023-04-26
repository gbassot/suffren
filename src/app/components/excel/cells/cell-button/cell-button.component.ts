import {Component, ElementRef, ViewChild} from '@angular/core';
import {CellComponent} from "../cell/cell.component";

@Component({
  selector: 'app-cell-button',
  templateUrl: './cell-button.component.html',
  styleUrls: ['./cell-button.component.scss']
})
export class CellButtonComponent extends CellComponent {
  @ViewChild('cell') cell!: ElementRef;

  override focusOnCell() {
    this.cell?.nativeElement.focus()
  }
}

import {Component, ElementRef, ViewChild} from '@angular/core';
import {CellComponent} from "../cell/cell.component";

@Component({
  selector: 'app-cell-input',
  templateUrl: './cell-input.component.html',
  styleUrls: ['./cell-input.component.scss']
})
export class CellInputComponent extends CellComponent {
  @ViewChild('cell') cell!: ElementRef;

  override focusOnCell() {
    this.cell?.nativeElement.focus()
    this.cell?.nativeElement.select()
  }
}

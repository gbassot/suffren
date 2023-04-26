import {Component, ElementRef, ViewChild} from '@angular/core';
import {CellComponent} from "../cell/cell.component";

@Component({
  selector: 'app-cell-switch',
  templateUrl: './cell-switch.component.html',
  styleUrls: ['./cell-switch.component.scss']
})
export class CellSwitchComponent extends CellComponent {
  @ViewChild('cell') cell!: ElementRef;

  override focusOnCell() {
    this.cell?.nativeElement.focus()
  }
}

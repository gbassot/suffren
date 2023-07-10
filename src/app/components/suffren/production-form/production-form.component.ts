import {Component} from '@angular/core';
import {AbstractFormComponent} from "../abstract-form/abstract-form.component";

@Component({
  selector: 'app-production-form',
  templateUrl: './production-form.component.html',
  styleUrls: ['./production-form.component.scss']
})
export class ProductionFormComponent extends AbstractFormComponent{
  override subFormKey = 'productionForm';
}

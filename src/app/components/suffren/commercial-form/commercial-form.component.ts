import {Component} from '@angular/core';
import {AbstractFormComponent} from "../abstract-form/abstract-form.component";

@Component({
  selector: 'app-commercial-form',
  templateUrl: './commercial-form.component.html',
  styleUrls: ['./commercial-form.component.scss']
})
export class CommercialFormComponent extends AbstractFormComponent{
  override subFormKey = 'commercialForm';
}

import {Component} from '@angular/core';
import {AbstractFormComponent} from "../abstract-form/abstract-form.component";
import {takeUntil, tap} from "rxjs/operators";
import {IProduitLong, IProduitPlat, ProductType} from "../../../model/data/icomponent.model";
import {selectCurrentComponent} from "../../../state/suffren.selector";

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent extends AbstractFormComponent{
  override subFormKey = 'serviceForm';

  currentComponent$ = this.store.select(selectCurrentComponent)

}

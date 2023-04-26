import {Component} from '@angular/core';
import {AbstractFormComponent} from "../abstract-form/abstract-form.component";

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent extends AbstractFormComponent{
  override subFormKey = 'commentForm';
}

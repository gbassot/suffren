import {Component, HostListener, OnDestroy, OnInit, Output} from '@angular/core';
import {SuffrenActions} from "../../../state/suffren.action";
import {OpportunityActions} from "../../../state/opportunity.action";
import {Store} from "@ngrx/store";
import {ComponentManagerService} from "../../../services/component-manager.service";
import {MessageService} from "primeng/api";
import {
  selectAnyFormOpened,
  selectCurrentLineIndex,
  selectSubForms
} from "../../../state/suffren.selector";
import {bufferTime, filter, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {QuoteActions} from "../../../state/quote.action";

@Component({
  selector: 'app-keyboard-nav',
  templateUrl: './keyboard-nav.component.html',
  styleUrls: ['./keyboard-nav.component.scss'],
  providers: [MessageService]
})
export class KeyboardNavComponent implements OnInit, OnDestroy{
  @HostListener('document:keydown', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowRight':
        if(event.ctrlKey) {
          this.store.dispatch(SuffrenActions.enterLine({ offset:1 }))
          event.preventDefault()
        }
        break;
      case 'ArrowLeft':
        if(event.ctrlKey) {
          this.store.dispatch(SuffrenActions.enterLine({ offset:-1 }))
          event.preventDefault()
        }
        break;
      case 'ArrowDown':
        if(event.ctrlKey) {
          this.store.dispatch(SuffrenActions.moveLine({ offset:1 }))
          event.preventDefault()
        }
        break;
      case 'ArrowUp':
        if(event.ctrlKey) {
          this.store.dispatch(SuffrenActions.moveLine({ offset:-1 }))
          event.preventDefault()
        }
        break;
      case 'Insert':
        this.store.dispatch(SuffrenActions.openSubForm({key:'productSelectorForm', display:{show:true}}))
        event.preventDefault()
        break;
      case 'Delete':
        if(this.currentLineIndex && this.currentLineIndex!==-1) {
          this.store.dispatch(OpportunityActions.removeLine({ index:this.currentLineIndex }))
        }
        event.preventDefault()
        break;
      case 'Enter':
        if(this.currentLineIndex!==-1) {
          this.store.select(selectAnyFormOpened).pipe(
            take(1),
            filter((bool) => !bool),
            tap(() => {
              this.store.dispatch(SuffrenActions.openSubForm({key: 'productForm', display: {show: true}}))
              event.preventDefault()
            })
          ).subscribe()
        }
        break;
      case 'Escape':
        this.escapePressed$.next(true);
        this.escapePressed$.pipe(
          bufferTime(300),
          tap((data) =>{
            if(data.length>0) {
              this.store.dispatch(QuoteActions.selectOpportunity({index:-1}))
              this.router.navigate(['/']);
            }
          }),
          take(1)
        ).subscribe()

        this.store.dispatch(SuffrenActions.escapePressed({bool: true}))
        break;
      case 'c':
        if(event.ctrlKey && this.currentLineIndex!==null) {
          this.messageService.add({ severity: 'success', summary: `Ligne ${this.currentLineIndex+1} copiée`, detail: `Ligne ${this.currentLineIndex+2} sélectionnée`});
          this.store.dispatch(OpportunityActions.copyLine({ index:this.currentLineIndex }))
          event.preventDefault()
        }
        break;
      case 'z':
        if(event.ctrlKey) {
          this.store.dispatch(OpportunityActions.rewindHistory({ step:-1 }))
          event.preventDefault()
        }
        break;
      case 'y':
        if(event.ctrlKey) {
          this.store.dispatch(OpportunityActions.rewindHistory({ step:1 }))
          event.preventDefault()
        }
        break;
    }
    const shorcut = this.subFormShotcuts.find((shorcut) => shorcut.key === event.key);
    if(event.ctrlKey && shorcut && this.currentLineIndex!==-1) {
      this.store.dispatch(SuffrenActions.openSubForm({key: shorcut.subForm, display: {show: true}}))
      event.preventDefault()
    }
  }

  subFormShotcuts = [
    {key:'p', subForm:'priceForm'},
    {key:'r', subForm:'discountForm'},
    {key:'m', subForm:'commentForm'},
    {key:'i', subForm:'commercialForm'},
    {key:'d', subForm:'productionForm'},
  ]

  shorcuts= [
    {code:'Inser', effect:'Créé une nouvelle ligne apres la ligne courante'},
    {code:'Delete', effect:'Supprime la ligne en cours'},
    {code:'Ctrl+c', effect:'Copie la ligne en cours'},
    {code:'Ctrl+Fleche droite', effect:"Descend d'un niveau d'un niveau dans l'édition d'une ligne"},
    {code:'Ctrl+Fleche gauche', effect:"Remonte d'un niveau dans la selection d'une ligne"},
    {code:'Ctrl+Fleche bas', effect:"Sélectionne la section suivante"},
    {code:'Ctrl+Fleche haut', effect:"Sélectionne la section suivante"},
    {code:'Enter', effect:"Edite le produit de la ligne en cours"},
    {code:'Escape', effect:"Ferme la modale en cours"},
    {code:'Tab', effect:"Sélectionne l'input suivant"},
    {code:'Ctrl+Tab', effect:"Sélectionne l'input précédent"},
    {code:'Ctrl+Z', effect:"Annule la derniere action"},
    {code:'Ctrl+Y', effect:"Rejoue l'action annulée"},
    {code:'Ctrl+R', effect:"Affiche le formulaire de remise"},
    {code:'Ctrl+P', effect:"Affiche le formulaire de prix"},
    {code:'Ctrl+M', effect:"Affiche le formulaire des commentaires"},
    {code:'Ctrl+D', effect:"Affiche le formulaire de production"},
    {code:'Ctrl+D', effect:"Affiche le formulaire de commerce"},
  ]
  currentLineIndex$ = this.store.select(selectCurrentLineIndex);
  subForms$ = this.store.select(selectSubForms);
  destroy$ = new Subject();
  currentLineIndex: number|null = null;
  escapePressed$ = new Subject<boolean>()

  constructor(
    private store: Store,
    private componentManager: ComponentManagerService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
     this.currentLineIndex$.pipe(
       takeUntil(this.destroy$),
       tap((index)=>this.currentLineIndex=index)
     ).subscribe()

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}

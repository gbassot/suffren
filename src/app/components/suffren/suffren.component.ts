import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectTableau} from "../../state/tableau.selector";
import {takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {SuffrenActions} from "../../state/suffren.action";
import {
  selectActiveSectionDepth1,
  selectCurrentLine,
  selectCurrentLineIndex, selectExpandComponent, selectGrandTotal,
  selectLineEntered
} from "../../state/suffren.selector";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OpportunityActions} from "../../state/opportunity.action";
import {MenuItem} from "primeng/api";
import {ContextMenu} from "primeng/contextmenu";
import {IComponent} from "../../model/data/icomponent.model";
import {Line} from "../../model/data/line.model";

@Component({
  selector: 'app-suffren',
  templateUrl: './suffren.component.html',
  styleUrls: ['./suffren.component.scss']
})
export class SuffrenComponent implements OnInit, OnDestroy{

  @HostListener('document:keydown', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event)
    switch (event.key) {
      case 'Enter':
        this.store.dispatch(SuffrenActions.enterLine({ offset:1 }))
        event.preventDefault()
        break;
      case 'Escape':
        this.store.dispatch(SuffrenActions.enterLine({ offset:-1 }))
        event.preventDefault()
        break;
      case 'ArrowRight':
        if(event.ctrlKey) {
          this.store.dispatch(SuffrenActions.moveSection({ offset:1 }))
        } else {
          this.store.dispatch(SuffrenActions.enterLine({ offset:1 }))
        }
        event.preventDefault()
        break;
      case 'ArrowLeft':
        if(event.ctrlKey) {
          this.store.dispatch(SuffrenActions.moveSection({ offset:-1 }))
        } else {
          this.store.dispatch(SuffrenActions.enterLine({ offset:-1 }))
        }
        event.preventDefault()
        break;
      case 'ArrowDown':
        if(event.ctrlKey) {
          this.store.dispatch(SuffrenActions.moveSection({ offset:1 }))
        } else {
          this.store.dispatch(SuffrenActions.moveLine({ offset:1 }))
        }
        event.preventDefault()
        break;
      case 'ArrowUp':
        if(event.ctrlKey) {
          this.store.dispatch(SuffrenActions.moveSection({ offset:-1 }))
        } else {
          this.store.dispatch(SuffrenActions.moveLine({ offset:-1 }))
        }
        event.preventDefault()
        break;
      case 'Insert':
        this.addLine(event, this.currentLineIndex);
        event.preventDefault()
        break;
      case 'Delete':
        if(this.currentLineIndex!==null) {
          this.store.dispatch(OpportunityActions.removeLine({ index:this.currentLineIndex }))
        }
        event.preventDefault()
        break;
      case 'c':
        if(event.ctrlKey && this.currentLineIndex!==null) {
          this.store.dispatch(OpportunityActions.copyLine({ index:this.currentLineIndex }))
        }
        event.preventDefault()
        break;
    }
  }


  @ViewChild('rightClickMenu') rightClickMenu: ContextMenu;
  tableau$ = this.store.select(selectTableau);
  currentLineIndex$ = this.store.select(selectCurrentLineIndex);
  currentLine$ = this.store.select(selectCurrentLine);
  lineEntered$ = this.store.select(selectLineEntered);
  activeSectionDepth1$ = this.store.select(selectActiveSectionDepth1);
  expandComponent$ = this.store.select(selectExpandComponent);
  grandTotal$ = this.store.select(selectGrandTotal);
  destroy$ = new Subject();

  sideBarVisible = false;
  sideBar2Visible = false;
  currentLineIndex: number|null = null;

  items: MenuItem[];

  constructor(private store: Store, private fb: FormBuilder) {}

  sideBarClosed(): void {
    this.store.dispatch(SuffrenActions.enterLine({ offset:-1 }))
  }

  selectLine(index: number, enter: boolean=true): void {
    this.store.dispatch(SuffrenActions.selectLine({ lineId:index }))
    if(enter) {
      this.store.dispatch(SuffrenActions.enterLine({ offset:1 }))
    }
  }

  drop(event:any): void {
    this.store.dispatch(OpportunityActions.reorderLine({previous:event.previousIndex, current:event.currentIndex}));
    this.store.dispatch(SuffrenActions.selectLine({ lineId:event.currentIndex }))
  }
  dropComponent(event:any, index: number): void {
    this.store.dispatch(OpportunityActions.reorderComponent({lineIndex: index, previous:event.previousIndex, current:event.currentIndex}));
  }

  removeComponent(lineIndex:number, index: number): void {
    this.store.dispatch(OpportunityActions.removeComponent({lineIndex, index}));
  }

  ngOnInit() {
    this.tableau$.pipe(
      takeUntil(this.destroy$),
      tap((tableau)=> {
        this.store.dispatch(SuffrenActions.updateTableau({tableau}));
      })
    ).subscribe();

    this.lineEntered$.pipe(
      takeUntil(this.destroy$),
      tap((depth)=> {
        this.sideBarVisible = depth>=1;
        this.sideBar2Visible = depth>=2;
      })
    ).subscribe();

    this.currentLineIndex$.pipe(
      tap((index)=> {
        document.getElementById('line-'+index)?.scrollIntoView(false);
        this.currentLineIndex = index;
      })
    ).subscribe()

    this.items = this.getItemMenu();
  }

  onLinkRightClicked(lineIndex: number,componentIndex: number|null, component: IComponent|null, e: any): void {
    if (this.rightClickMenu) {
      this.items = this.getItemMenu(lineIndex, componentIndex, component);
      this.rightClickMenu.show(e);
      e.preventDefault();
    }
  }

  getItemMenu(lineIndex: number|null=null,componentIndex: number|null=null, component: IComponent|null=null): MenuItem[] {
    const items : MenuItem[] = [];
    if(componentIndex!==null) {
      items.push( {
        label: 'Frais additionnels',
        icon: 'pi pi-fw pi-list',
        items: [
          {
            label: 'Ajouter un service',
            icon: 'pi pi-fw pi-plus-circle',
            command: (event) => {
              const component: IComponent = {
                description: 'nouveau service', quantity: 1, total: 0, unitPrice: 12,unitCost:2, margin:0,
                type:'service'

              };
              (lineIndex!==null)?
                this.store.dispatch(OpportunityActions.addComponent({lineIndex, component})):null
            }
          },
          {
            label: 'Supprimer '+(component?(component.description):''),
            icon: 'pi pi-fw pi-trash',
            command: (event) => (lineIndex!==null && componentIndex!==null)?
              this.store.dispatch(OpportunityActions.removeComponent({lineIndex, index:componentIndex+1})):null
          }
        ]
      })
    }
    items.push( {
      label: 'Ligne',
      icon: 'pi pi-fw pi-shopping-cart',
      items: [
        {
          label: 'Copier la ligne '+((lineIndex??0)+1),
          icon: 'pi pi-fw pi-copy',
          command: (event) => {
            const component: IComponent = {
              description: 'nouveau service', quantity: 1, total: 0, unitPrice: 12,unitCost:2, margin:0,
              type:'service'

            };
            (lineIndex!==null)?
              this.store.dispatch(OpportunityActions.copyLine({index:(lineIndex)})):null
          }
        },
        {
          label: 'Supprimer la ligne '+((lineIndex??0)+1),
          icon: 'pi pi-fw pi-trash',
          command: (event) => (lineIndex!==null)?
            this.store.dispatch(OpportunityActions.removeLine({index:(lineIndex)})):null
        }
      ]
    })
    return items;
  }

  toggleComponent(bool: boolean) {
    this.store.dispatch(SuffrenActions.toggleExpandComponent({bool}))
  }

  addLine(event:any, lineIndex: number|null=null) {
    const line: Line = {
      id: '0',
      description: '',
      totalPrice: 0,
      totalCost: 0,
      margin: 1,
      unitCost:0, unitPrice:0, quantity:0,
      components:[{
        type:'material',
        description:'test',
        unitPrice:0,
        unitCost:0,
        quantity:0,
        total:0,
        margin:0
      }]
    }
    this.store.dispatch(OpportunityActions.addLine({line, index:lineIndex}));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}

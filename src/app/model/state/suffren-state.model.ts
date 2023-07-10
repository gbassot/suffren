import {Line} from "../data/line.model";

export class SuffrenState {
  tableau: ReadonlyArray<Line>
  main: {
    selectedLine: number|null
    selectedComponent: number|null
    lineDepth: number
    activeSectionDepth1: number
  }
  subForms: {
    discountForm: Display
    priceForm: Display
    productForm: Display
    serviceForm: Display
    commentForm: Display
    commercialForm: Display
    productionForm: Display
    productSelectorForm: Display
    showComponents: Display
    showComments: Display
    showHelp: Display
  }
  subFormOpenOrder: string[]
}

export class Display {
  show: boolean
}

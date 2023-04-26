import {IComponent} from "./icomponent.model";

export interface Line {
  id: string;
  description: string;
  unitPrice: number;
  unitCost: number;
  quantity: number;
  totalPrice: number;
  totalCost: number;
  margin: number;
  components: Array<IComponent>
  warning?: string;
}

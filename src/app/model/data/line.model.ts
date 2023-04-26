import {IAccessoire, IComponent, IProduitLong, IProduitPlat, IPSP} from "./icomponent.model";

export interface Line {
  id: string;
  description: string;
  unitPrice: number;
  unitCost: number;
  quantity: number;
  totalPrice: number;
  totalDiscount: number;
  totalCost: number;
  margin: number;
  components: Array<IComponent|IProduitLong|IProduitPlat|IAccessoire|IPSP>;
  discount: number;
  warning?: string;
}

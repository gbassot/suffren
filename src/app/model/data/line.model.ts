import {IAccessoire, IComponent, IProduitLong, IProduitPlat, IPSP} from "./icomponent.model";
import {IPrice} from "./iprice.model";

export interface Line extends IPrice{
  id: string;
  description: string;
  quantity: number;
  components: Array<IComponent|IProduitLong|IProduitPlat|IAccessoire|IPSP>;
  discount: number;
  warning?: string;
}

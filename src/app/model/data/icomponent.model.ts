export enum ProductType {
  long='long',
  plat='plat',
  accessoire='accessoire',
  psp='psp',
}

export class IComponent {
  type: string;
  description: string;
  unitCost: number;
  unitPrice: number;
  quantity: number;
  total: number;
  margin: number;
}

export class IProduitLong extends IComponent{
  override type: ProductType.long
  shape: string;
  grade: string;
  dimensions: string;
  lengthType: string;
  length: number;
}

export class IProduitPlat extends IComponent{
  override type: ProductType.plat
  shape: string;
  grade: string;
  dimensions: string;
}

export class IAccessoire extends IComponent{
  override type: ProductType.accessoire
  shape: string;
  grade: string;
}

export class IPSP extends IComponent{
  override type: ProductType.psp
  grade: string;
  dimensions: string;
}

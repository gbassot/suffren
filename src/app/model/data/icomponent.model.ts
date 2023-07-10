import {IPrice} from "./iprice.model";

export enum ProductType {
  long='long',
  plat='plat',
  accessoire='accessoire',
  psp='psp',
}

export interface IComponent extends IPrice{
  type: string;
  description: string;
  quantity: number;
}

export interface IProduitLong extends IComponent{
  type: ProductType.long
  shape: string;
  grade: string;
  dimensions: string;
  lengthType: string;
  length: number;
}

export interface IProduitPlat extends IComponent{
  type: ProductType.plat
  shape: string;
  grade: string;
  dimensions: string;
}

export interface IAccessoire extends IComponent{
  type: ProductType.accessoire
  shape: string;
  grade: string;
}

export interface IPSP extends IComponent{
  type: ProductType.psp
  grade: string;
  dimensions: string;
}

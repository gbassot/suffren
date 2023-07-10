export interface IPrice {
  totalPrice?: number;
  totalPriceWithoutDiscount?: number;
  totalDiscount?: number;
  totalCost?: number;
  unitPrice?: number;
  unitPriceWithoutDiscount?: number;
  unitPriceDiscounted?: number;
  unitDiscount?: number;
  unitCost?: number;
  absoluteMargin?: number;
  relativeMargin?: number
}

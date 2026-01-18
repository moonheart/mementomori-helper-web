/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { ShopCurrency } from "./shopCurrency";

export class ShopItem {
    id: number;
    name: string = "";
    price: number;
    currency: ShopCurrency;
    stock: number;
    maxStock: number;
    discount: number;
}

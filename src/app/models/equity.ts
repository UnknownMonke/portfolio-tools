import { Geography } from "./geography";
import { Sector } from "./sector";

/**
 * contient les détails sur l'équité, y compris sa répartition géographique et sectorielle
 */
export class Equity {
  equityId: number;
  name: string;
  ticker: string;
  type: string;
  active: boolean;
  currency: string; //TODO implement enums
  quantity: number;
  amount: number;

  geography: Geography[];
  sectors: Sector[];


  constructor(
    equityId: number,
    name: string,
    ticker: string,
    type: string,
    active: boolean,
    currency: string,
    quantity: number,
    amount: number,
    geography?: Geography[],
    sectors?: Sector[]
  ) {
    this.equityId = equityId;
    this.name = name;
    this.ticker = ticker;
    this.type = type;
    this.active = active;
    this.currency = currency;
    this.quantity = quantity;
    this.amount = amount;
    this.geography = geography? geography : [];
    this.sectors = sectors? sectors : [];
  }
}

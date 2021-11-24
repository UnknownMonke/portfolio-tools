import { GeographyExposition } from "./geographyExposition";
import { SectorExposition } from "./sectorExposition";

/** Contient les détails sur l'actif, y compris sa répartition géographique et sectorielle */
export interface Equity {
  _id: string; // Hash avec la source de l'actif et son id locale (ex: {Degiro, degiroId})
  name: string;
  ticker: string;
  type: string;
  active: boolean; // Position en cours ou cloturée
  currency: string; //TODO implement enums
  quantity: number;
  amount: number;

  geography: GeographyExposition[];
  sectors: SectorExposition[];
}

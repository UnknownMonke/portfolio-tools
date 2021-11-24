import Utils from "src/app/common/utils";
import { createHash } from "crypto";
import { Equity } from "../equity";

export default class EquityMapper {

  // Mappe un actif non existant en base depuis l'objet DeGiro
  static mapEquityRawDegiro(equityRaw: any): Equity {
    return {
      _id: this.createId('DeGiro', equityRaw.id),
      name: equityRaw.productData?.name? equityRaw.productData.name : '', //TODO exceptions
      ticker: equityRaw.productData?.symbol? equityRaw.productData.symbol : '',
      type: equityRaw.productData?.productType? equityRaw.productData.productType : '',
      active: Utils.validateVariable(equityRaw.size),
      currency: equityRaw.productData?.currency? equityRaw.productData.currency : '',
      quantity: equityRaw.size? equityRaw.size : 0,
      amount: Utils.validateVariable(equityRaw.value) ? equityRaw.value? equityRaw.value : 0 : 0,

      geography: [],
      sectors: []
    }
  }

  private static createId(source: string, localId: string): string {
    const sha1 = createHash('sha1');
    sha1.update(source);
    sha1.update(localId);
    return sha1.digest('hex');
  }
}

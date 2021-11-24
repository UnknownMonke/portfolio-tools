import { Injectable } from '@angular/core';
import { Equity } from '../../models/equity';
import { EQUITIES } from '../../common/constants/mock-equities';
import Utils from '../../common/utils';
import { environment } from 'src/environments/environment';
import DeGiro, { DeGiroEnums, DeGiroTypes } from 'degiro-api'
import EquityMapper from 'src/app/models/mapper/equity-mapper';
import { EquityService } from '../equity/equity.service';
const { PORTFOLIO_POSITIONS_TYPE_ENUM } = DeGiroEnums;


/**
 * Service de login et récupération du portfolio et des balances DeGiro
 * - Récupération des données et conversion en DTO
 * - Persistence du DTO:
 *  - Ajout sans exposure si l'actif n'existe pas en base
 *  - Mise à jour de l'actif sauf l'exposure si l'actif existe
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(
    private equityService: EquityService
  ) {}

  //private portfolioUrl = 'portfolio';

  load(): Equity[] {
    /*(async () => {
      const degiro = DeGiro.create({username: environment.degiroUser, pwd: environment.degiroPassword});

      if(!await degiro.isLogin({ secure: true })) {
        const accountData = await degiro.login();
        console.log(accountData);
      }

      const jsessionId = degiro.getJSESSIONID();
      console.log(jsessionId);


      const portfolio = await degiro.getPortfolio({
        type: PORTFOLIO_POSITIONS_TYPE_ENUM.ALL,
        getProductDetails: true,
      })
      console.log(portfolio)
    })();*/
    //console.log(EQUITIES); //TODO login et sécurité


    //gestion du JSON reçu ici
    let portfolioData: Equity[] = [];

    EQUITIES
      .filter(val => val.positionType === "PRODUCT")
      .forEach(function(position) {
        const equity = EquityMapper.mapEquityRawDegiro(position);
        portfolioData.push(equity);
      });

    this.persistEquities(portfolioData);

    return portfolioData;
  }

  /*leave(): void {
    (async () => {
      const degiro = new DeGiro({});
      if(await degiro.isLogin({ secure: true })) {
        await degiro.logout();
      }
    })();
  }*/

  /**
   * - Récupère les actifs actuellement en base
   *  - Actif toujours présent mais activé ou déactivé pour les positions cloturées
   *  - Actif non présent = nouvelle position à rajouter
   */
  persistEquities(equities: Equity[]): void {
    const equityMap = new Map<string, Equity>();
    equities.map(equity => equityMap.set(equity._id, equity));

    this.equityService.getEquities()
      .subscribe((data: Equity[]) => {
        console.log(data);
        if(data.length) {

          const dataMap = new Map<string, Equity>();
          data.map(equity => dataMap.set(equity._id, equity));

          const equitiesToEdit = data.filter(equity => equityMap.has(equity._id));
          const equitiesToAdd = equities.filter(equity => !dataMap.has(equity._id));

          this.equityService.editEquities(equitiesToEdit);
          this.equityService.addEquities(equitiesToAdd);

        } else {
          this.equityService.addEquities(equities);
        }
      });
  }
}

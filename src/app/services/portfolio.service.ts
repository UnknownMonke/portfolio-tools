import { Injectable } from '@angular/core';
import { Equity } from '../dto/equity';
import { EQUITIES } from '../dto/mock-equities';
import Utils from '../common/utils';
import { environment } from 'src/environments/environment';
import DeGiro, { DeGiroEnums, DeGiroTypes } from 'degiro-api'
const { PORTFOLIO_POSITIONS_TYPE_ENUM } = DeGiroEnums;

// service de login et récupération du portfolio et des balances DeGiro
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor() { }

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
    console.log(EQUITIES); //TODO login et sécurité


    //gestion du JSON reçu ici
    let portfolioData: Equity[] = [];

    EQUITIES
    .filter(val => val.positionType === "PRODUCT")
    .forEach(function(position) {
      const equity: Equity = {
        equityId: Number(position.id),
        name: position.productData?.name,
        ticker: position.productData?.symbol,
        type: position.productData?.productType,
        active: Utils.validateVariable(position.size),
        quantity: position.size,
        amount: Utils.validateVariable(position.value) ? position.value : 0
      };

      portfolioData.push(equity);
    })

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
}

import { Pipe, PipeTransform } from "@angular/core";

/** Retourne la valeur unique d'une propriété d'une array d'objet filtrée selon une propriété de l'objet (possiblement identique) avec le nom d'une colonne de la table */
@Pipe({ name: 'filterBy' })
export class ColumnFilterPipe implements PipeTransform {
  transform(valueArray: any[], propertyFilter: string, propertyResult: string, columnName: string): any {
      return valueArray.filter(value => value[propertyFilter] === columnName)[0][propertyResult];
  }
}

export interface Sector {
  _id: string; // Identique au nom du champ id autogénéré par Mongo
  name: string;
  children: Sector[];
}

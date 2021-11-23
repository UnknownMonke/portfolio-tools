export interface Sector {
  _id: number; // Géré via un counter
  name: string;
  level: number; // 0 secteur principal
  parentId: number; // -1 pour les secteurs principaux
}

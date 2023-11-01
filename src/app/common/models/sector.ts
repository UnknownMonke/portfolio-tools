/**
 * DTO. Reflects the MongoDB document.
 */
export interface Sector {
  _id: number, // Handled via counter.
  name: string,
  level: number, // 0 for main Sector.
  parentId: number // -1 for main Sector.
}

export interface SectorExposition {
  sectorId: number,
  exposure: number
}

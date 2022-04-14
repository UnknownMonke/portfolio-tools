// DTO. Reflects the MongoDB document.
export interface Geography {
  _id: number; // Handled via counter.
  name: string;
}

export interface GeographyExposition {
  geography: Geography;
  exposure: number;
}

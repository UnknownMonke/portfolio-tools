/**
 * DTO. Reflects the MongoDB document.
 */
export interface Geography {
  _id: number, // Handled via counter. //TODO use strings
  name: string
}

export interface GeographyExposition {
  geographyId: number,
  exposure: number
}

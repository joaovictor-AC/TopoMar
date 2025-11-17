// Represents a geographical coordinate with latitude and longitude.
export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Feature= {
  type: string;
  properties: {
    featureType: string;
    hauteurAuDessusNiveauMer?: string;  // Height above sea level (older format)
    altitude?: string;                   // Height above sea level (newer format)
    nom: string;
    alt1?: number | null;                // Height reference for rock
    alt2?: number | null;                // Secondary height reference
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}
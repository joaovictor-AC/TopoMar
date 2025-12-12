// Représente une coordonnée géographique avec latitude et longitude.
export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Feature= {
  type: string;
  properties: {
    featureType: string;
    altitude: string;
    nom: string;
    alt1?: number | null;  // Référence de hauteur pour le rocher
    alt2?: number | null;  // Référence de hauteur secondaire
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export type FeatureCollection = {
  type: string;
  deltaReference?: string;
  maxDistanceReference?: string;
  features: Feature[];
}

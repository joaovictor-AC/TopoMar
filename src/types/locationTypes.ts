// Represents a geographical coordinate with latitude and longitude.
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
    alt1?: number | null;  // Height reference for rock
    alt2?: number | null;  // Secondary height reference
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export type FeatureCollection = {
  type: string;
  features: Feature[];
  deltaReference?: string;
}

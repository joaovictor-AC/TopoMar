// Represents a geographical coordinate with latitude and longitude.
export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Feature= {
  type: string;
  properties: {
    featureType: string;
    hauteurAuDessusNiveauMer: string;
    nom: string;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export type FeatureCollection = {
  type: string;
  features: Feature[];
}
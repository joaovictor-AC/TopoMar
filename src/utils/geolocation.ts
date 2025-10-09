const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

interface Coords {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
}

export const getBearing = ({ lat1, lon1, lat2, lon2 }: Coords): number => {
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  const deltaLon = lon2Rad - lon1Rad;

  const y = Math.sin(deltaLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);

  let bearingRad = Math.atan2(y, x);
  
  const bearingDeg = (toDegrees(bearingRad) + 360) % 360;

  return bearingDeg;
};

export const getDistance = ({ lat1, lon1, lat2, lon2 }: Coords): number => {
    const R = 6371e3; // Raio da Terra em metros
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // em metros
    return distance;
};
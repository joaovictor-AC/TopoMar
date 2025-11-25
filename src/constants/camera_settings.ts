export const HORIZONTAL_FOV = 50;   // plus étroit (essaie 45–55)
export const VERTICAL_FOV   = 35;   // “fenêtre” verticale (essaie 30–40)
export const FOV_MARGIN     = 3;    // marge anti-bord pour éviter le clignotement
export const HEADING_OFFSET = 0;    // ajuste à +/– quelques degrés si besoin
export const MAX_DEPTH_METERS = 3000; // distance à partir de laquelle on considère "fond"
export const HYSTERESIS_DEG = 3;   // marge de grâce quand on sort à peine du cône 
export const VIS_STICK_MS = 600; //on conserve l'étiquette environ 0,8s après sortie du cône 
export const SMOOTHING_ALPHA_HEADING = .2;  // Lissage azimut (0.15->0.2 = plus réactif)
export const SMOOTHING_ALPHA_PITCH = .3;    // Lissage pitch
export const MIN_DISTANCE = 50;              // Distance minimale en mètres
export const MAX_DISTANCE = 5000;            // Distance maximale en mètres
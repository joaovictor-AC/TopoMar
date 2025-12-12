/**
 * Calcule la visibilité d'un rocher en fonction de son altitude et du niveau de la mer.
 *
 * Formule : visibilité = Alt1 - HE
 * Si visibilité < 0, le rocher est submergé (non visible).
 * Si visibilité >= 0, le rocher est visible.
 *
 * @param {number | null | undefined} alt - Hauteur au-dessus du niveau de la mer (hauteurAuDessusNiveauMer).
 * @param {number} seaLevelValue - Hauteur actuelle du niveau de la mer (HE).
 * @param {number} delta - Constante d'ajustement (4.5).
 * @returns { isVisible: boolean, visibilityHeight: number | null}
 */
export const calculateVisibility = (
  alt1: number | null | undefined,
  seaLevelValue: number,
  delta: number
): {
  isVisible: boolean;
  visibilityHeight: number | null;
} => {

  if (alt1 === null || alt1 === undefined || isNaN(alt1)) {
    return { isVisible: false, visibilityHeight: null };
  }

  const visibilityHeight = (alt1 + delta) - seaLevelValue;
  return {
    isVisible: visibilityHeight >= 0,
    visibilityHeight: visibilityHeight,
  };
};


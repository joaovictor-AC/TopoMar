/**
 * Calculates the visibility of a rock based on its altitude and sea level
 *
 * Formula: visibility = Alt1 - HE
 * If visibility < 0, rock is submerged (not visible)
 * If visibility >= 0, rock is visible
 *
 * @param {number | null | undefined} alt - Height above sea level (hauteurAuDessusNiveauMer)
 * @param {number} seaLevelValue - Current sea level height (HE)
 * @param {number} delta - Adjustment constant (4.5)
 * @returns { isVisible: boolean, visibilityHeight: number | null}
 */
export const calculateVisibility = (
  alt1: number | null | undefined,
  seaLevelValue: number,
  delta: number = 4.5
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


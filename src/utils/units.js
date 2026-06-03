// ─── Unit Conversion Utilities ────────────────────────────────────────────────
// Internal storage strategy:
//   Weight  → stored in grams (g)
//   Volume  → stored in milliliters (mL)
//   Count   → stored as items (each)
//
// All prices are stored as INR per BASE UNIT (g, mL, or item).
// Conversion factors below map any display unit → base unit.

export const UNIT_DIMENSIONS = {
  g:    'weight',
  kg:   'weight',
  mL:   'volume',
  L:    'volume',
  item: 'count',
};

// How many BASE units equal 1 of this display unit?
export const TO_BASE = {
  g:    1,
  kg:   1000,
  mL:   1,
  L:    1000,
  item: 1,
};

// How many of this display unit equal 1 BASE unit?
export const FROM_BASE = {
  g:    1,
  kg:   0.001,
  mL:   1,
  L:    0.001,
  item: 1,
};

export const UNIT_LABELS = {
  g:    'g',
  kg:   'kg',
  mL:   'mL',
  L:    'L',
  item: 'item',
};

export const UNITS_FOR_DIMENSION = {
  weight: ['g', 'kg'],
  volume: ['mL', 'L'],
  count:  ['item'],
};

/**
 * Convert a quantity from any unit to the base unit.
 * e.g. toBase(2, 'kg') → 2000 (grams)
 */
export function toBase(quantity, unit) {
  return parseFloat((quantity * TO_BASE[unit]).toPrecision(12));
}

/**
 * Convert a quantity from base unit to any display unit.
 * e.g. fromBase(2000, 'kg') → 2 (kg)
 */
export function fromBase(baseQuantity, unit) {
  return parseFloat((baseQuantity * FROM_BASE[unit]).toPrecision(12));
}

/**
 * Calculate total price given:
 *   - orderedQty in orderedUnit
 *   - pricePerBase (INR per base unit, e.g. INR per gram)
 *   Returns INR total
 */
export function calcPrice(orderedQty, orderedUnit, pricePerBase) {
  const baseQty = toBase(orderedQty, orderedUnit);
  return parseFloat((baseQty * pricePerBase).toFixed(4));
}

/**
 * Format a number as INR currency string
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

/**
 * Get compatible display units for a product's base unit
 */
export function compatibleUnits(baseUnit) {
  const dim = UNIT_DIMENSIONS[baseUnit];
  return UNITS_FOR_DIMENSION[dim] || [baseUnit];
}

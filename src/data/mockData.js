// ─── Mock Data ─────────────────────────────────────────────────────────────────
// pricePerBase = INR per BASE unit (g, mL, or item)
// stockBase    = quantity in BASE units

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    sku: 'ACET-001',
    name: 'Acetonitrile (HPLC Grade)',
    category: 'Solvents',
    description: 'High purity acetonitrile suitable for HPLC applications.',
    baseUnit: 'mL',
    stockBase: 50000,       // 50 L in mL
    pricePerBase: 0.18,     // ₹0.18 per mL
    minOrderBase: 100,      // 100 mL minimum
    tags: ['solvent', 'hplc', 'organic'],
  },
  {
    id: 'p2',
    sku: 'ETOH-500',
    name: 'Ethanol (Absolute)',
    category: 'Solvents',
    description: '99.9% pure ethanol, denatured-free.',
    baseUnit: 'mL',
    stockBase: 200000,      // 200 L
    pricePerBase: 0.09,     // ₹0.09 per mL
    minOrderBase: 500,
    tags: ['solvent', 'alcohol'],
  },
  {
    id: 'p3',
    sku: 'NACL-002',
    name: 'Sodium Chloride (Analytical)',
    category: 'Inorganic Salts',
    description: 'Analytical grade NaCl, ≥99.5% purity.',
    baseUnit: 'g',
    stockBase: 100000,      // 100 kg in grams
    pricePerBase: 0.04,     // ₹0.04 per g
    minOrderBase: 100,
    tags: ['salt', 'inorganic', 'analytical'],
  },
  {
    id: 'p4',
    sku: 'BSA-LAB',
    name: 'Bovine Serum Albumin (BSA)',
    category: 'Biochemicals',
    description: 'Fraction V, ≥98% purity, for protein standard use.',
    baseUnit: 'g',
    stockBase: 500,         // 500 g
    pricePerBase: 85,       // ₹85 per g
    minOrderBase: 1,
    tags: ['protein', 'biochemical'],
  },
  {
    id: 'p5',
    sku: 'TRIS-BUF',
    name: 'Tris Base (Molecular Biology)',
    category: 'Buffers',
    description: 'Ultra-pure Tris for molecular biology buffers.',
    baseUnit: 'g',
    stockBase: 5000,
    pricePerBase: 1.2,      // ₹1.2 per g
    minOrderBase: 10,
    tags: ['buffer', 'molbio'],
  },
  {
    id: 'p6',
    sku: 'MEOH-HP',
    name: 'Methanol (HPLC Grade)',
    category: 'Solvents',
    description: 'HPLC grade methanol, <0.001% water.',
    baseUnit: 'mL',
    stockBase: 150000,      // 150 L
    pricePerBase: 0.06,
    minOrderBase: 500,
    tags: ['solvent', 'hplc', 'organic'],
  },
  {
    id: 'p7',
    sku: 'FILT-045',
    name: 'Syringe Filter 0.45µm (PVDF)',
    category: 'Consumables',
    description: 'PVDF membrane, 25mm diameter, sterile.',
    baseUnit: 'item',
    stockBase: 1000,
    pricePerBase: 28,       // ₹28 per item
    minOrderBase: 1,
    tags: ['filter', 'consumable'],
  },
  {
    id: 'p8',
    sku: 'HCL-37',
    name: 'Hydrochloric Acid (37%)',
    category: 'Acids',
    description: 'ACS reagent grade, 37% in water.',
    baseUnit: 'mL',
    stockBase: 20000,       // 20 L
    pricePerBase: 0.22,
    minOrderBase: 250,
    tags: ['acid', 'inorganic'],
  },
];

export const CATEGORIES = ['All', 'Solvents', 'Inorganic Salts', 'Biochemicals', 'Buffers', 'Consumables', 'Acids'];

// ─── Mock Order Store (simulates DB in memory) ─────────────────────────────────
let _orders = [
  {
    id: 'ORD-001',
    userId: 'user1',
    userName: 'Priya Sharma',
    status: 'pending',
    createdAt: '2025-06-01T09:22:00Z',
    items: [
      { productId: 'p3', productName: 'Sodium Chloride (Analytical)', sku: 'NACL-002', orderedQty: 5, orderedUnit: 'kg', baseUnit: 'g', baseQty: 5000, pricePerBase: 0.04, lineTotal: 200 },
      { productId: 'p1', productName: 'Acetonitrile (HPLC Grade)', sku: 'ACET-001', orderedQty: 2, orderedUnit: 'L', baseUnit: 'mL', baseQty: 2000, pricePerBase: 0.18, lineTotal: 360 },
    ],
    total: 560,
    notes: 'Urgent for ongoing synthesis project.',
  },
  {
    id: 'ORD-002',
    userId: 'user2',
    userName: 'Arjun Mehta',
    status: 'approved',
    createdAt: '2025-06-02T14:05:00Z',
    items: [
      { productId: 'p4', productName: 'Bovine Serum Albumin (BSA)', sku: 'BSA-LAB', orderedQty: 50, orderedUnit: 'g', baseUnit: 'g', baseQty: 50, pricePerBase: 85, lineTotal: 4250 },
    ],
    total: 4250,
    notes: '',
  },
];

let _orderCounter = 3;

export function getOrders() {
  return [..._orders];
}

export function addOrder(order) {
  const id = `ORD-${String(_orderCounter++).padStart(3, '0')}`;
  const newOrder = { id, ...order, createdAt: new Date().toISOString() };
  _orders = [newOrder, ..._orders];
  return newOrder;
}

export function updateOrderStatus(orderId, status) {
  _orders = _orders.map(o => o.id === orderId ? { ...o, status } : o);
}

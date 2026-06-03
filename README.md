# AasaMedChem — Inventory & Order Management System

> React + Vite frontend-only implementation for the AasaMedChem hackathon assignment.

---

## Quick Start

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

### Demo Credentials

| Role   | Username | Password |
|--------|----------|----------|
| Admin  | admin    | admin123 |
| Seller | priya    | user123  |
| Seller | arjun    | user123  |

---

## Project Structure

```
src/
├── App.jsx                   # Root component, page routing
├── main.jsx                  # React entry point
├── styles.css                # All CSS (design tokens + components)
├── context/
│   ├── AuthContext.jsx       # Auth state, login/logout, RBAC
│   └── CartContext.jsx       # Cart state, add/remove, totals
├── data/
│   └── mockData.js           # Mock products, orders, in-memory store
├── pages/
│   ├── LoginPage.jsx         # Login form with demo fill buttons
│   ├── ProductsPage.jsx      # Product catalogue with search + filter
│   ├── CartPage.jsx          # Cart review + order placement
│   ├── MyOrdersPage.jsx      # Seller's order history
│   └── AdminOrdersPage.jsx   # Admin order management + status updates
├── components/
│   ├── Navbar.jsx            # Navigation bar with role-aware links
│   └── ProductCard.jsx       # Single product card with unit selector
└── utils/
    └── units.js              # All unit conversion logic
```

---

## Authentication & RBAC

Authentication is simulated in-memory via `AuthContext`. In production this would be replaced by a JWT/session backend call.

**Roles:**

- **Admin** — Can view all incoming quotations, see product + unit + pricing breakdowns, update order status (pending → approved / rejected / shipped).
- **Seller** — Can browse/search products, add to cart, place quotations, view their own order history.

Pages are conditionally rendered based on `user.role`. The Navbar shows role-appropriate navigation links only.

---

## Unit Conversion & Storage Strategy

### Internal Base Units

| Dimension | Base Unit | Rationale |
|-----------|-----------|-----------|
| Weight    | **g** (grams)    | Smallest common weight unit; no floating-point loss for milligrams+ |
| Volume    | **mL** (millilitres) | Smallest common volume unit |
| Count     | **item**          | Indivisible; 1:1 |

All stock quantities (`stockBase`) and order line items (`baseQty`) are stored in these base units.

### Conversion Factors

```
kg → g   : × 1000
g  → kg  : × 0.001
L  → mL  : × 1000
mL → L   : × 0.001
item → item : × 1
```

These live in `src/utils/units.js` as `TO_BASE` and `FROM_BASE` maps.

### Pricing Storage

Prices are stored as **INR per base unit**:
- `pricePerBase = 0.18` means ₹0.18 per mL
- `pricePerBase = 85` means ₹85 per gram (e.g., BSA protein)

This makes price calculation trivially correct regardless of which unit the user orders in:

```
lineTotal = toBase(orderedQty, orderedUnit) × pricePerBase
```

### Where Conversions Happen

| Location | What |
|----------|------|
| `utils/units.js → toBase()` | Convert ordered qty → base qty before saving |
| `utils/units.js → fromBase()` | Convert base qty → display unit for UI display |
| `utils/units.js → calcPrice()` | `toBase(qty, unit) × pricePerBase` |
| `ProductCard.jsx` | Live price preview using `calcPrice` on every keystroke |
| `CartContext.jsx → addItem()` | Computes `baseQty` and `lineTotal` before storing in cart |
| `CartPage.jsx` | Shows both ordered unit AND base qty in the table for transparency |
| `AdminOrdersPage.jsx` | Shows ordered qty, base qty, and rate per base unit side by side |

### PostgreSQL Types (for production implementation)

| Field | PostgreSQL Type | Reason |
|-------|----------------|--------|
| `price_per_base` | `NUMERIC(20, 10)` | Arbitrary precision; no floating-point error for money |
| `stock_base` | `NUMERIC(20, 6)` | Large values (millions of mL) with sub-unit precision |
| `ordered_qty` | `NUMERIC(20, 6)` | User may enter e.g. 0.025 kg |
| `base_qty` | `NUMERIC(20, 6)` | Derived conversion result |
| `line_total` | `NUMERIC(20, 4)` | INR with 4 decimal places |
| `grand_total` | `NUMERIC(20, 4)` | Sum of line totals |

Using `NUMERIC` (arbitrary precision decimal) over `FLOAT` prevents IEEE 754 rounding errors that would be unacceptable in financial/pricing contexts.

---

## Ordering Flow

1. **Browse** — Seller browses the product catalogue, searches by name/SKU/tag, filters by category.
2. **Select unit** — Each product card shows a quantity input + unit dropdown (only units compatible with the product dimension are shown).
3. **Live pricing** — As the seller types a quantity, the estimated INR total updates instantly below the input field.
4. **Add to cart** — Items are added with their ordered unit preserved; `baseQty` and `lineTotal` are computed at add time.
5. **Review cart** — Cart page shows a table with both the ordered quantity and the internal base quantity for transparency, along with rate and line total.
6. **Conversion note** — A highlighted note explains the base-unit storage strategy to the user.
7. **Place quotation** — Creates an order record (in-memory mock; would be a DB insert in production).
8. **Admin review** — Admin sees all quotations with full unit/conversion/pricing breakdown and can update status.

---

## Design Decisions & Assumptions

- **Frontend-only**: All data is in-memory (mock). A production build would replace `mockData.js` with API calls and `AuthContext` with a real auth flow.
- **No external state library**: React context is sufficient for this scale.
- **Dark theme**: Chosen to reflect the precision/laboratory context — industrial/utilitarian aesthetic.
- **INR formatting**: Uses `Intl.NumberFormat('en-IN', { currency: 'INR' })` — respects Indian number formatting (lakhs, crores).
- **Vite + React**: Chosen over Next.js per the assignment's override instruction ("make frontend only using react not next").

export const retailTotal = rows => rows.reduce((sum, row) => sum + row.priceCents * row.quantity, 0);
export const wholesaleTotal = rows => Math.round(
  rows.reduce((sum, row) => sum + row.priceCents * row.quantity, 0) * 0.9,
);
export const priceTotal = () => 0;

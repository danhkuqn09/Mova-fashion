const calculateDiscount = (order) => {
  const total = Number(order.original_total || order.pricing?.original_total || 0);
  if (!order.voucher) return 0;

  let discount = Math.round(total * order.voucher.discount_percent / 100);
  if (order.voucher.max_discount_amount) {
    discount = Math.min(discount, order.voucher.max_discount_amount);
  }
  return discount;
};

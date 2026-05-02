class SaleNetService {
  const SaleNetService();

  double calculate({
    required double salePrice,
    required double platformFee,
    required double shippingByMe,
  }) {
    return salePrice - platformFee - shippingByMe;
  }
}
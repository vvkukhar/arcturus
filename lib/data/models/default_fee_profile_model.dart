class DefaultFeeProfileModel {
  final double saleFeePercent;
  final double shippingPaidByMe;
  final double shippingPaidByBuyer;
  final double purchaseShipping;
  final double purchaseExtraCosts;

  const DefaultFeeProfileModel({
    required this.saleFeePercent,
    required this.shippingPaidByMe,
    required this.shippingPaidByBuyer,
    required this.purchaseShipping,
    required this.purchaseExtraCosts,
  });

  factory DefaultFeeProfileModel.initial() {
    return const DefaultFeeProfileModel(
      saleFeePercent: 0,
      shippingPaidByMe: 0,
      shippingPaidByBuyer: 0,
      purchaseShipping: 0,
      purchaseExtraCosts: 0,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'saleFeePercent': saleFeePercent,
      'shippingPaidByMe': shippingPaidByMe,
      'shippingPaidByBuyer': shippingPaidByBuyer,
      'purchaseShipping': purchaseShipping,
      'purchaseExtraCosts': purchaseExtraCosts,
    };
  }

  factory DefaultFeeProfileModel.fromMap(Map<String, dynamic> map) {
    return DefaultFeeProfileModel(
      saleFeePercent: (map['saleFeePercent'] as num?)?.toDouble() ?? 0,
      shippingPaidByMe: (map['shippingPaidByMe'] as num?)?.toDouble() ?? 0,
      shippingPaidByBuyer:
          (map['shippingPaidByBuyer'] as num?)?.toDouble() ?? 0,
      purchaseShipping: (map['purchaseShipping'] as num?)?.toDouble() ?? 0,
      purchaseExtraCosts: (map['purchaseExtraCosts'] as num?)?.toDouble() ?? 0,
    );
  }
}

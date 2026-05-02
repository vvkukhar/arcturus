class MarketSnapshotFormValuesService {
  const MarketSnapshotFormValuesService();

  double parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.')) ?? 0;
  }

  int? parseIntOrNull(String value) {
    if (value.trim().isEmpty) return null;
    return int.tryParse(value);
  }

  double spread({
    required double low,
    required double high,
  }) {
    return high - low;
  }

  double midpoint({
    required double low,
    required double high,
  }) {
    return (low + high) / 2;
  }
}
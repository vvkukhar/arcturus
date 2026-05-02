class RiskAnalysisService {
  bool isHighRisk({
    required double buy,
    required double market,
  }) {
    return buy > market;
  }
}

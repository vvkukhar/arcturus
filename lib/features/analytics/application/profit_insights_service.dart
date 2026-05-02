class ProfitInsightsService {
  String getInsight(double profit) {
    if (profit < 0) return 'Loss detected';
    if (profit < 50) return 'Low margin';
    if (profit < 150) return 'Healthy deal';
    return 'High profit deal';
  }
}

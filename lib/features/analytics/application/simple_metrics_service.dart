class SimpleMetricsService {
  double totalProfit(List<double> profits) {
    return profits.fold(0, (a, b) => a + b);
  }
}

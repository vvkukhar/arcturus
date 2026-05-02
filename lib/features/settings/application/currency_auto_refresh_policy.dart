// lib/features/settings/application/currency_auto_refresh_policy.dart

class CurrencyAutoRefreshPolicy {
  final Duration maxAge;

  const CurrencyAutoRefreshPolicy({
    required this.maxAge,
  });

  factory CurrencyAutoRefreshPolicy.defaultPolicy() {
    return const CurrencyAutoRefreshPolicy(
      maxAge: Duration(hours: 12),
    );
  }
}

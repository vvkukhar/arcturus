import 'dart:math';
export 'package:lego_trading_manager/data/models/app_models.dart';

class AppUtils {
  static String generateId() => '${DateTime.now().microsecondsSinceEpoch}${Random().nextInt(1000)}';
  
  static double parseDouble(String value) {
    return double.tryParse(value.replaceAll(',', '.').trim()) ?? 0.0;
  }
  
  static int parseInt(String value) {
    return int.tryParse(value.trim()) ?? 1;
  }
  
  static String money(double value, {String currency = 'UAH'}) {
    return '${value.toStringAsFixed(2)} $currency';
  }
  
  static String dateYMD(DateTime date) {
    return date.toIso8601String().split('T').first;
  }
}

class AppValidators {
  static String? requiredText(String? value, [String label = 'Field']) => 
    (value == null || value.trim().isEmpty) ? '$label is required' : null;
    
  static String? positiveOrZero(String? value, [String label = 'Field']) {
    final parsed = double.tryParse(value?.replaceAll(',', '.') ?? '');
    if (parsed == null || parsed < 0) return '$label must be >= 0';
    return null;
  }
}
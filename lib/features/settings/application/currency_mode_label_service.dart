// lib/features/settings/application/currency_mode_label_service.dart

class CurrencyModeLabelService {
  String label(bool officialMode) {
    return officialMode ? 'Official NBU Mode' : 'Manual Mode';
  }
}

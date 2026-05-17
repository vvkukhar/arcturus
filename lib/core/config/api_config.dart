import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  static String get baseUrl {
    // В реліз-моді (Production) стукаємо на реальний сервер Render
    if (kReleaseMode) {
      return 'https://arcturus-api-idsb.onrender.com/api/v1';
    }
    // У дев-моді стукаємо на локальний (переконайся, що в тебе в .env є API_URL)
    // 10.0.2.2 - це спеціальна IP для Android-емулятора, щоб достукатися до localhost комп'ютера
    return dotenv.env['API_URL'] ?? 'http://10.0.2.2:4000/api/v1';
  }
  
  static const int timeoutSeconds = 15;
}
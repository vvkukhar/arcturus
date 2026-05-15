import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  // Змінили дефолтний URL, додавши /v1
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? 'https://arcturus-api-idsb.onrender.com/api/v1';
  static const int timeoutSeconds = 15;
}
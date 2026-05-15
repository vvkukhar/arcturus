import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  // ФІКС 2: Ігноруємо локальний .env і жорстко стукаємо на Render
  static String get baseUrl => 'https://arcturus-api-idsb.onrender.com/api/v1';
  static const int timeoutSeconds = 15;
}
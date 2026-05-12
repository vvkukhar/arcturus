import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  // Якщо в .env є API_BASE_URL — беремо його, якщо ні — жорстко зашита лінка на Render
  static String get baseUrl => dotenv.env['API_BASE_URL'] ?? 'https://arcturus-api-idsb.onrender.com/api';
  static const int timeoutSeconds = 15;
}
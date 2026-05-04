import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiConfig {
  static String get baseUrl {
    final envUrl = dotenv.env['API_BASE_URL'];
    if (envUrl != null && envUrl.isNotEmpty) {
      return envUrl;
    }
    
    if (kReleaseMode || kIsWeb) {
      return 'https://arcturus-api-idsb.onrender.com/api';
    }
    return 'http://10.0.2.2:4000/api';
  }
}
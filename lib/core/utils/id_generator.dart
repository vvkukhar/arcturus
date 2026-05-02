// lib/core/utils/id_generator.dart

class IdGenerator {
  static String next() {
    return DateTime.now().microsecondsSinceEpoch.toString();
  }
}

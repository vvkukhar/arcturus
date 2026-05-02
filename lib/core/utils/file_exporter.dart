// lib/core/utils/file_exporter.dart

import 'dart:io';

class FileExporter {
  static Future<void> exportText({
    required String filename,
    required String content,
  }) async {
    final file = File(filename);
    await file.writeAsString(content);
  }
}

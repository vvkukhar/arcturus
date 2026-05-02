import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'export_service.dart';

final exportServiceProvider = Provider(
  (ref) => ExportService(),
);

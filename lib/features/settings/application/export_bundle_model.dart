// lib/features/settings/application/export_bundle_model.dart

class ExportBundleModel {
  final String title;
  final String fileName;
  final int recordCount;

  const ExportBundleModel({
    required this.title,
    required this.fileName,
    required this.recordCount,
  });
}

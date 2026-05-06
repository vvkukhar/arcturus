import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/settings/application/export_bundle_model.dart';

class ExportBundleCard extends ConsumerWidget {
  final ExportBundleModel bundle;

  const ExportBundleCard({
    super.key,
    required this.bundle,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(i18n.t(bundle.title)),
        subtitle: Text(bundle.fileName),
        trailing: Text(
          bundle.recordCount.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
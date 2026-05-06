import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/analytics/application/velocity_bucket_model.dart';

class VelocityBucketCard extends ConsumerWidget {
  final VelocityBucketModel bucket;

  const VelocityBucketCard({
    super.key,
    required this.bucket,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: ListTile(
        title: Text(i18n.t(bucket.label)),
        trailing: Text(
          bucket.count.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}
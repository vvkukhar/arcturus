// lib/features/analytics/presentation/widgets/velocity_bucket_card.dart

import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/velocity_bucket_model.dart';

class VelocityBucketCard extends StatelessWidget {
  final VelocityBucketModel bucket;

  const VelocityBucketCard({
    super.key,
    required this.bucket,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(bucket.label),
        trailing: Text(
          bucket.count.toString(),
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
    );
  }
}

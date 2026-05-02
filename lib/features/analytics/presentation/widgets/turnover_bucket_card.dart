import 'package:flutter/material.dart';
import 'package:lego_trading_manager/features/analytics/application/turnover_bucket_model.dart';

class TurnoverBucketCard extends StatelessWidget {
  final TurnoverBucketModel bucket;

  const TurnoverBucketCard({
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

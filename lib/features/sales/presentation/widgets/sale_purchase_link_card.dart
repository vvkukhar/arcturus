import 'package:flutter/material.dart';
import 'package:lego_trading_manager/data/models/purchase_model.dart';

class SalePurchaseLinkCard extends StatelessWidget {
  final PurchaseModel? purchase;
  final VoidCallback onLink;
  final VoidCallback? onUnlink;

  const SalePurchaseLinkCard({
    super.key,
    required this.purchase,
    required this.onLink,
    this.onUnlink,
  });

  @override
  Widget build(BuildContext context) {
    if (purchase == null) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              const Row(
                children: [
                  Icon(Icons.link_off_outlined),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'No purchase linked',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'Link this sale to a purchase record to calculate real profit and ROI.',
                style: TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: FilledButton.icon(
                  onPressed: onLink,
                  icon: const Icon(Icons.link_outlined),
                  label: const Text('Link Purchase'),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                const Icon(Icons.link_outlined),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Linked purchase: ${purchase!.id}',
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 16,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Expanded(child: Text('Item ID')),
                Text(
                  purchase!.itemId,
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                const Expanded(child: Text('Cost')),
                Text(
                  '${purchase!.finalTotal.toStringAsFixed(2)} ${purchase!.currency}',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: FilledButton.tonalIcon(
                    onPressed: onLink,
                    icon: const Icon(Icons.swap_horiz_outlined),
                    label: const Text('Change Link'),
                  ),
                ),
                if (onUnlink != null) ...[
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onUnlink,
                      icon: const Icon(Icons.link_off_outlined),
                      label: const Text('Unlink'),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
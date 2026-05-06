import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class WatchlistAvailableCashInputCard extends ConsumerStatefulWidget {
  final double value;
  final ValueChanged<double> onChanged;

  const WatchlistAvailableCashInputCard({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  ConsumerState<WatchlistAvailableCashInputCard> createState() =>
      _WatchlistAvailableCashInputCardState();
}

class _WatchlistAvailableCashInputCardState
    extends ConsumerState<WatchlistAvailableCashInputCard> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(
      text: widget.value.toStringAsFixed(2),
    );
  }

  @override
  void didUpdateWidget(covariant WatchlistAvailableCashInputCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _controller.text = widget.value.toStringAsFixed(2);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: TextField(
          controller: _controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          decoration: InputDecoration(
            labelText: i18n.t('Available cash'),
            hintText: i18n.t('Enter current free cash'),
          ),
          onChanged: (value) {
            final parsed = double.tryParse(value.replaceAll(',', '.')) ?? 0;
            widget.onChanged(parsed);
          },
        ),
      ),
    );
  }
}
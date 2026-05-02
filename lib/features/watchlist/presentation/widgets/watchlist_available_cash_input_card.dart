import 'package:flutter/material.dart';

class WatchlistAvailableCashInputCard extends StatefulWidget {
  final double value;
  final ValueChanged<double> onChanged;

  const WatchlistAvailableCashInputCard({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  State<WatchlistAvailableCashInputCard> createState() =>
      _WatchlistAvailableCashInputCardState();
}

class _WatchlistAvailableCashInputCardState
    extends State<WatchlistAvailableCashInputCard> {
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
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: TextField(
          controller: _controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          decoration: const InputDecoration(
            labelText: 'Available cash',
            hintText: 'Enter current free cash',
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

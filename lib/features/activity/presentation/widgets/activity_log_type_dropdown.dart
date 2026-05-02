// lib/features/activity/presentation/widgets/activity_log_type_dropdown.dart
import 'package:flutter/material.dart';

class ActivityLogTypeDropdown extends StatelessWidget {
  final String? value;
  final ValueChanged<String?> onChanged;

  const ActivityLogTypeDropdown({
    super.key,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    const options = <DropdownMenuItem<String?>>[
      DropdownMenuItem<String?>(
        value: null,
        child: Text('All types'),
      ),
      DropdownMenuItem<String?>(
        value: 'report',
        child: Text('Report'),
      ),
      DropdownMenuItem<String?>(
        value: 'purchase',
        child: Text('Purchase'),
      ),
      DropdownMenuItem<String?>(
        value: 'sale',
        child: Text('Sale'),
      ),
      DropdownMenuItem<String?>(
        value: 'watchlist',
        child: Text('Watchlist'),
      ),
      DropdownMenuItem<String?>(
        value: 'market',
        child: Text('Market'),
      ),
      DropdownMenuItem<String?>(
        value: 'inventory',
        child: Text('Inventory'),
      ),
    ];

    return DropdownButtonFormField<String?>(
      value: value,
      decoration: const InputDecoration(labelText: 'Type'),
      items: options,
      onChanged: onChanged,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';
import 'package:lego_trading_manager/features/market/application/market_filter_model.dart';

class MarketFilterSheet extends ConsumerStatefulWidget {
  final MarketFilterModel initialFilter;

  const MarketFilterSheet({
    super.key,
    required this.initialFilter,
  });

  @override
  ConsumerState<MarketFilterSheet> createState() => _MarketFilterSheetState();
}

class _MarketFilterSheetState extends ConsumerState<MarketFilterSheet> {
  late MarketFilterModel _filter;
  late final TextEditingController _sourceController;
  late final TextEditingController _itemController;

  @override
  void initState() {
    super.initState();
    _filter = widget.initialFilter;
    _sourceController =
        TextEditingController(text: widget.initialFilter.sourceContains ?? '');
    _itemController = TextEditingController(
      text: widget.initialFilter.itemTitleContains ?? '',
    );
  }

  @override
  void dispose() {
    _sourceController.dispose();
    _itemController.dispose();
    super.dispose();
  }

  void _apply() {
    Navigator.of(context).pop(
      _filter.copyWith(
        sourceContains: _sourceController.text.trim().isEmpty
            ? null
            : _sourceController.text.trim(),
        itemTitleContains: _itemController.text.trim().isEmpty
            ? null
            : _itemController.text.trim(),
      ),
    );
  }

  void _clear() {
    Navigator.of(context).pop(MarketFilterModel.empty);
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 16,
          top: 16,
          bottom: 16 + MediaQuery.of(context).viewInsets.bottom,
        ),
        child: ListView(
          shrinkWrap: true,
          children: [
            Text(
              i18n.t('Market Filters'),
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _sourceController,
              decoration: InputDecoration(
                labelText: i18n.t('Source contains'),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _itemController,
              decoration: InputDecoration(
                labelText: i18n.t('Item title contains'),
              ),
            ),
            const SizedBox(height: 12),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(i18n.t('With URL only')),
              value: _filter.withUrlOnly,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(withUrlOnly: value);
                });
              },
            ),
            SwitchListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(i18n.t('Positive trend only')),
              subtitle: Text(i18n.t('Show items where latest average is above previous average')),
              value: _filter.positiveTrendOnly,
              onChanged: (value) {
                setState(() {
                  _filter = _filter.copyWith(positiveTrendOnly: value);
                });
              },
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _clear,
                    child: Text(i18n.t('common.clear')),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _apply,
                    child: Text(i18n.t('common.apply')),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
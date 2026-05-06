import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class SettingsLinkList extends ConsumerWidget {
  final List<Map<String, dynamic>> items;

  const SettingsLinkList({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Column(
      children: items
          .map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Card(
                child: ListTile(
                  title: Text(i18n.t(item['title']?.toString() ?? '-')),
                  subtitle: Text(i18n.t(item['subtitle']?.toString() ?? '-')),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    final route = item['route']?.toString();
                    if (route != null && route.isNotEmpty) {
                      Navigator.of(context).pushNamed(route);
                    }
                  },
                ),
              ),
            ),
          )
          .toList(),
    );
  }
}
import 'package:flutter/material.dart';

class SettingsLinkList extends StatelessWidget {
  final List<Map<String, dynamic>> items;

  const SettingsLinkList({
    super.key,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: items
          .map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Card(
                child: ListTile(
                  title: Text(item['title']?.toString() ?? '-'),
                  subtitle: Text(item['subtitle']?.toString() ?? '-'),
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
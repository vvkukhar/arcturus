import 'package:flutter/material.dart';

class AppInfoBanner extends StatelessWidget {
  final String text;

  const AppInfoBanner({
    super.key,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(text),
      ),
    );
  }
}

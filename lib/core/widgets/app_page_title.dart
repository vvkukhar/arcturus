import 'package:flutter/material.dart';

class AppPageTitle extends StatelessWidget {
  final String title;

  const AppPageTitle({
    super.key,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w800,
      ),
    );
  }
}

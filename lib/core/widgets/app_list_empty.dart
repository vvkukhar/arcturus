import 'package:flutter/material.dart';

class AppListEmpty extends StatelessWidget {
  final String title;

  const AppListEmpty({
    super.key,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        title,
        style: const TextStyle(color: Colors.white70),
      ),
    );
  }
}

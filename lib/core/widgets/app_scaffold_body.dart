import 'package:flutter/material.dart';

class AppScaffoldBody extends StatelessWidget {
  final Widget child;

  const AppScaffoldBody({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: child,
    );
  }
}

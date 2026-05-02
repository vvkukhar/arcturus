import 'package:flutter/material.dart';

class AppDangerButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String title;

  const AppDangerButton({
    super.key,
    required this.onPressed,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return FilledButton.tonal(
      onPressed: onPressed,
      child: Text(title),
    );
  }
}

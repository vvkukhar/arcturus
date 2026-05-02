import 'package:flutter/material.dart';

class AppPrimaryButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final String title;

  const AppPrimaryButton({
    super.key,
    required this.onPressed,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: onPressed,
      child: Text(title),
    );
  }
}

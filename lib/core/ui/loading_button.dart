import 'package:flutter/material.dart';

class LoadingButton extends StatelessWidget {
  final bool loading;
  final VoidCallback? onPressed;
  final String text;

  const LoadingButton({
    super.key,
    required this.loading,
    required this.onPressed,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: loading ? null : onPressed,
      child: loading
          ? const SizedBox(
              height: 16,
              width: 16,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Text(text),
    );
  }
}

import 'package:flutter/material.dart';

class AppSectionSpacing extends StatelessWidget {
  final double height;

  const AppSectionSpacing({
    super.key,
    this.height = 16,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(height: height);
  }
}
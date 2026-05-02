import 'package:flutter/material.dart';

class RoiColorResolver {
  static Color resolve(double roi) {
    if (roi >= 100) return Colors.green;
    if (roi >= 50) return Colors.lightGreen;
    if (roi >= 20) return Colors.orange;
    if (roi > 0) return Colors.amber;
    return Colors.redAccent;
  }
}

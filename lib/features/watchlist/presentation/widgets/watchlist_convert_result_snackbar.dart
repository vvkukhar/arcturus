import 'package:flutter/material.dart';

class WatchlistConvertResultSnackBar {
  static SnackBar success(String title) {
    return SnackBar(
      content: Text('Converted to inventory: $title'),
    );
  }
}
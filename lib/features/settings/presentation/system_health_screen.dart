import 'package:flutter/material.dart';

class SystemHealthScreen extends StatelessWidget {
  const SystemHealthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('System Health'),
      ),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'System health screen is not implemented yet.',
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
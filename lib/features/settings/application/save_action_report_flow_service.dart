import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/settings/presentation/widgets/save_action_report_dialog.dart';

class SaveActionReportFlowService {
  final Ref ref;

  SaveActionReportFlowService(this.ref);

  Future<Map<String, String>?> openDialog(
    BuildContext context, {
    required String initialTitle,
    required String initialNote,
  }) async {
    final result = await showDialog<Map<String, String>>(
      context: context,
      builder: (_) => SaveActionReportDialog(
        initialTitle: initialTitle,
        initialNote: initialNote,
      ),
    );
    return result;
  }
}
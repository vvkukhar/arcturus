import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';

final partOutProjectLinesProvider =
    Provider.family<List<PartOutLineModel>, String>((ref, projectId) {
  return ref.read(partOutRepositoryProvider).getLinesByProjectId(projectId);
});

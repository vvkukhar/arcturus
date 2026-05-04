// lib/features/partout/presentation/partout_project_details_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/local_datasources_provider.dart';
import 'package:lego_trading_manager/core/utils/partout_calculator.dart';
import 'package:lego_trading_manager/data/models/partout_line_model.dart';
import 'package:lego_trading_manager/data/models/partout_project_model.dart';
import 'package:lego_trading_manager/data/repositories/partout_repository.dart';
import 'package:lego_trading_manager/features/partout/presentation/add_partout_line_screen.dart';
import 'package:lego_trading_manager/features/partout/presentation/edit_partout_line_screen.dart';
import 'package:lego_trading_manager/features/partout/presentation/edit_partout_project_screen.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_line_card.dart';
import 'package:lego_trading_manager/features/partout/presentation/widgets/partout_metric_tile.dart';

class PartOutProjectDetailsScreen extends ConsumerStatefulWidget {
  final PartOutProjectModel project;

  const PartOutProjectDetailsScreen({
    super.key,
    required this.project,
  });

  @override
  ConsumerState<PartOutProjectDetailsScreen> createState() =>
      _PartOutProjectDetailsScreenState();
}

class _PartOutProjectDetailsScreenState
    extends ConsumerState<PartOutProjectDetailsScreen> {
  late final PartOutRepository _repository;

  late PartOutProjectModel _project;
  List<PartOutLineModel> _lines = [];

  @override
  void initState() {
    super.initState();
    _repository = PartOutRepository(ref.read(partoutLocalDatasourceProvider));
    _project = widget.project;
    _load();
  }

  void _load() {
    _project = _repository.getProjectById(_project.id) ?? _project;
    _lines = _repository.getLinesByProjectId(_project.id);
  }

  Future<void> _addLine() async {
    final result = await Navigator.of(context).push<PartOutLineModel>(
      MaterialPageRoute(
        builder: (_) => AddPartOutLineScreen(projectId: _project.id),
      ),
    );

    if (result == null) return;

    _repository.addLine(result);

    setState(() {
      _load();
    });
  }

  Future<void> _editLine(PartOutLineModel line) async {
    final result = await Navigator.of(context).push<PartOutLineModel>(
      MaterialPageRoute(
        builder: (_) => EditPartOutLineScreen(line: line),
      ),
    );

    if (result == null) return;

    _repository.updateLine(result);

    setState(() {
      _load();
    });
  }

  void _deleteLine(PartOutLineModel line) {
    _repository.deleteLine(line.id);
    setState(() {
      _load();
    });
  }

  Future<void> _editProject() async {
    final result = await Navigator.of(context).push<PartOutProjectModel>(
      MaterialPageRoute(
        builder: (_) => EditPartOutProjectScreen(project: _project),
      ),
    );

    if (result == null) return;

    _repository.updateProject(result);

    setState(() {
      _project = result;
      _load();
    });
  }

  Future<void> _deleteProject() async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (_) {
        return AlertDialog(
          title: const Text('Delete project'),
          content: const Text('Delete this part-out project?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );

    if (shouldDelete != true) return;

    _repository.deleteProject(_project.id);

    if (!mounted) return;
    Navigator.of(context).pop({'deleted': true, 'id': _project.id});
  }

  @override
  Widget build(BuildContext context) {
    final expectedProfit = PartOutCalculator.expectedProfit(
      totalCost: _project.totalCost,
      expectedPartOutValue: _project.expectedPartOutValue,
    );
    final actualProfit = PartOutCalculator.actualProfit(
      totalCost: _project.totalCost,
      actualPartOutValue: _project.actualPartOutValue,
    );

    return Scaffold(
      appBar: AppBar(
        title: const Text('Part-out Project'),
        actions: [
          IconButton(
            onPressed: _editProject,
            icon: const Icon(Icons.edit_outlined),
          ),
          IconButton(
            onPressed: _deleteProject,
            icon: const Icon(Icons.delete_outline),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addLine,
        icon: const Icon(Icons.add),
        label: const Text('Add Line'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            _project.sourceSetTitle,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 8),
          Text('Status: ${_project.status.name}'),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.35,
            children: [
              PartOutMetricTile(
                title: 'Total Cost',
                value: _project.totalCost.toStringAsFixed(2),
              ),
              PartOutMetricTile(
                title: 'Expected Value',
                value: _project.expectedPartOutValue.toStringAsFixed(2),
              ),
              PartOutMetricTile(
                title: 'Actual Value',
                value: _project.actualPartOutValue.toStringAsFixed(2),
              ),
              PartOutMetricTile(
                title: 'Expected Profit',
                value: expectedProfit.toStringAsFixed(2),
              ),
              PartOutMetricTile(
                title: 'Actual Profit',
                value: actualProfit.toStringAsFixed(2),
              ),
              PartOutMetricTile(
                title: 'Lines',
                value: _lines.length.toString(),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Text(
            'Lines',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 10),
          if (_lines.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text('No part-out lines yet.'),
              ),
            )
          else
            ..._lines.map(
              (line) => PartOutLineCard(
                line: line,
                onTap: () => _editLine(line),
                onDelete: () => _deleteLine(line),
              ),
            ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}
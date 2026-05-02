class AppDataCleanupReportModel {
  final int removedAllocations;
  final int removedLinks;
  final int adjustedAllocations;

  const AppDataCleanupReportModel({
    required this.removedAllocations,
    required this.removedLinks,
    required this.adjustedAllocations,
  });

  bool get changedAnything {
    return removedAllocations > 0 ||
        removedLinks > 0 ||
        adjustedAllocations > 0;
  }

  String get summary {
    if (!changedAnything) {
      return 'No integrity issues found.';
    }

    return [
      if (removedAllocations > 0)
        'Removed $removedAllocations orphan allocations',
      if (removedLinks > 0) 'Removed $removedLinks orphan links',
      if (adjustedAllocations > 0)
        'Adjusted $adjustedAllocations allocations',
    ].join(' • ');
  }
}
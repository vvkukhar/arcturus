class BackupNameBuilder {
  static String fullBackup() {
    final date = DateTime.now().toIso8601String().replaceAll(':', '-');
    return 'full_backup_$date.json';
  }
}

class CommandCenterBadgeService {
  String? format(int count) {
    if (count <= 0) return null;
    if (count > 999) return '999+';
    return count.toString();
  }
}

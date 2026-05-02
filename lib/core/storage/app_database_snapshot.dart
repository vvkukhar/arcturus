class AppDatabaseSnapshot {
  final List<Map<String, dynamic>> inventory;
  final List<Map<String, dynamic>> purchases;
  final List<Map<String, dynamic>> sales;
  final List<Map<String, dynamic>> watchlist;
  final List<Map<String, dynamic>> market;
  final List<Map<String, dynamic>> partoutProjects;
  final List<Map<String, dynamic>> partoutLines;

  const AppDatabaseSnapshot({
    required this.inventory,
    required this.purchases,
    required this.sales,
    required this.watchlist,
    required this.market,
    required this.partoutProjects,
    required this.partoutLines,
  });

  factory AppDatabaseSnapshot.empty() {
    return const AppDatabaseSnapshot(
      inventory: [],
      purchases: [],
      sales: [],
      watchlist: [],
      market: [],
      partoutProjects: [],
      partoutLines: [],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'inventory': inventory,
      'purchases': purchases,
      'sales': sales,
      'watchlist': watchlist,
      'market': market,
      'partoutProjects': partoutProjects,
      'partoutLines': partoutLines,
    };
  }

  factory AppDatabaseSnapshot.fromMap(Map<String, dynamic> map) {
    List<Map<String, dynamic>> readList(String key) {
      final raw = map[key];
      if (raw is! List) return [];

      return raw
          .whereType<Map>()
          .map((e) => Map<String, dynamic>.from(e))
          .toList();
    }

    return AppDatabaseSnapshot(
      inventory: readList('inventory'),
      purchases: readList('purchases'),
      sales: readList('sales'),
      watchlist: readList('watchlist'),
      market: readList('market'),
      partoutProjects: readList('partoutProjects'),
      partoutLines: readList('partoutLines'),
    );
  }
}

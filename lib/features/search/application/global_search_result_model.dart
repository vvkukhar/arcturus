class GlobalSearchResultModel {
  final String title;
  final String subtitle;
  final String type;
  final String route;
  final String? id;
  final Object? payload;
  final int priorityScore;

  const GlobalSearchResultModel({
    required this.title,
    required this.subtitle,
    required this.type,
    required this.route,
    required this.id,
    this.payload,
    this.priorityScore = 0,
  });

  GlobalSearchResultModel copyWith({
    String? title,
    String? subtitle,
    String? type,
    String? route,
    String? id,
    Object? payload,
    int? priorityScore,
  }) {
    return GlobalSearchResultModel(
      title: title ?? this.title,
      subtitle: subtitle ?? this.subtitle,
      type: type ?? this.type,
      route: route ?? this.route,
      id: id ?? this.id,
      payload: payload ?? this.payload,
      priorityScore: priorityScore ?? this.priorityScore,
    );
  }
}
class Category {
  final int id;
  final String name;
  final String icon;
  final String type;
  final String? priority;

  Category({
    required this.id,
    required this.name,
    required this.icon,
    required this.type,
    this.priority,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'],
      icon: json['icon'],
      type: json['type'],
      priority: json['priority'],
    );
  }
}

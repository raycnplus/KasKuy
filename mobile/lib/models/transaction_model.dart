class Transaction {
  final int id;
  final String type;
  final int amount;
  final String description;
  final String date;
  final int categoryId;
  final String categoryName;
  final String categoryIcon;

  Transaction({
    required this.id,
    required this.type,
    required this.amount,
    required this.description,
    required this.date,
    required this.categoryId,
    required this.categoryName,
    required this.categoryIcon,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    final category = json['category'];

    return Transaction(
      id: _toInt(json['id']),
      type: json['type']?.toString() ?? '',
      amount: _toInt(json['amount']),               // <-- perbaikan utama
      description: json['description']?.toString() ?? '',
      date: json['date']?.toString() ?? '',
      categoryId: (category is Map)
          ? _toInt(category['id'])
          : 0,
      categoryName: (category is Map)
          ? category['name']?.toString() ?? ''
          : category?.toString() ?? '',
      categoryIcon: (category is Map)
          ? category['icon']?.toString() ?? '📦'
          : '📦',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "type": type,
      "amount": amount,
      "category_id": categoryId,
      "description": description,
      "date": date,
    };
  }

  // ---- helper aman untuk semua bentuk angka
  static int _toInt(dynamic v) {
    if (v == null) return 0;
    if (v is int) return v;
    if (v is double) return v.toInt();
    if (v is String) {
      // buang pemisah ribuan/koma, lalu parse double -> int
      final cleaned = v.replaceAll(',', '');
      final d = double.tryParse(cleaned);
      if (d != null) return d.toInt();
      final i = int.tryParse(cleaned);
      return i ?? 0;
    }
    return 0;
  }
}

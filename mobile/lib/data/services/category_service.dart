import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '/core/constants/api_endpoints.dart';
import '/models/category_model.dart';

class CategoryService {
  static Future<bool> createCategory({
    required String name,
    required String icon,
    required String type,
    String? priority,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) return false;

      final response = await http.post(
        Uri.parse(ApiEndpoints.categories),
        headers: {'Authorization': 'Bearer $token'},
        body: {
          'name': name,
          'icon': icon,
          'type': type,
          'priority': priority ?? '',
        },
      );

      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print("Error createCategory: $e");
      return false;
    }
  }

  static Future<List<Category>> getCategories() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) return [];

      final response = await http.get(
        Uri.parse(ApiEndpoints.categories),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final body = json.decode(response.body);

        // Ambil isi "data" -> List
        final List data = body['data'];

        return data.map((e) => Category.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      print("Error getCategories: $e");
      return [];
    }
  }

  static Future<bool> updateCategory({
    required int id,
    required String name,
    required String icon,
    required String type,
    String? priority,
  }) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) return false;

      final response = await http.put(
        Uri.parse("${ApiEndpoints.categories}/$id"),
        headers: {'Authorization': 'Bearer $token'},
        body: {
          'name': name,
          'icon': icon,
          'type': type,
          'priority': priority ?? '',
        },
      );

      return response.statusCode == 200;
    } catch (e) {
      print("Error updateCategory: $e");
      return false;
    }
  }

  static Future<bool> deleteCategory(int id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) return false;

      final response = await http.delete(
        Uri.parse("${ApiEndpoints.categories}/$id"),
        headers: {'Authorization': 'Bearer $token'},
      );

      return response.statusCode == 200;
    } catch (e) {
      print("Error deleteCategory: $e");
      return false;
    }
  }

  static Future<List<Category>> getIncomeCategories(String token) async {
    final res = await http.get(
      Uri.parse(ApiEndpoints.incomeCategories),
      headers: {"Authorization": "Bearer $token", "Accept": "application/json"},
    );

    if (res.statusCode == 200) {
      final body = jsonDecode(res.body);

      if (body is Map && body.containsKey("Pemasukan")) {
        final List data = body["Pemasukan"];
        return data.map((json) => Category.fromJson(json)).toList();
      } else {
        return [];
      }
    } else {
      throw Exception("Gagal load income categories: ${res.body}");
    }
  }

  static Future<List<Category>> getExpenseCategories(String token) async {
    final res = await http.get(
      Uri.parse(ApiEndpoints.expenseCategories),
      headers: {"Authorization": "Bearer $token", "Accept": "application/json"},
    );

    if (res.statusCode == 200) {
      final body = jsonDecode(res.body);

      if (body is Map && body.containsKey("Pengeluaran")) {
        final List data = body["Pengeluaran"];
        return data.map((json) => Category.fromJson(json)).toList();
      } else {
        return [];
      }
    } else {
      throw Exception("Gagal load expense categories: ${res.body}");
    }
  }
}

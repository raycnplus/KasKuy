import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '/models/transaction_model.dart';
import '/core/constants/api_endpoints.dart';

class TransactionService {
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<List<Transaction>> getTransactions() async {
    final token = await _getToken();
    final res = await http.get(
      Uri.parse(ApiEndpoints.transactions),
      headers: {"Authorization": "Bearer $token"},
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return (data['data'] as List)
          .map((json) => Transaction.fromJson(json))
          .toList();
    } else {
      throw Exception("Failed to fetch transactions");
    }
  }

  Future<Transaction> createTransaction(Transaction trx) async {
    final token = await _getToken();
    final res = await http.post(
      Uri.parse(ApiEndpoints.transactions),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode(trx.toJson()),
    );

    if (res.statusCode == 201 || res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return Transaction.fromJson(data['data']);
    } else {
      throw Exception("Failed to create transaction");
    }
  }

  Future<Transaction> updateTransaction(int id, Transaction trx) async {
    final token = await _getToken();
    final res = await http.put(
      Uri.parse("${ApiEndpoints.transactions}/$id"),
      headers: {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      },
      body: jsonEncode(trx.toJson()),
    );

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      return Transaction.fromJson(data['data']);
    } else {
      throw Exception("Failed to update transaction");
    }
  }

  Future<void> deleteTransaction(int id) async {
    final token = await _getToken();
    final res = await http.delete(
      Uri.parse("${ApiEndpoints.transactions}/$id"),
      headers: {"Authorization": "Bearer $token"},
    );

    if (res.statusCode != 200) {
      throw Exception("Failed to delete transaction");
    }
  }
}

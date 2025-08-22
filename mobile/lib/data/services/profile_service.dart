import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../models/user_model.dart';
import '/core/constants/api_endpoints.dart';

class ProfileService {
  static Future<User?> getProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    if (token == null) {
      return null;
    }

    final url = Uri.parse("${ApiEndpoints.baseUrl}/profile");

    final response = await http.get(
      url,
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer $token",
      },
    );

    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      final data = jsonResponse["data"];
      return User.fromJson(data);
    } else {
      throw Exception("Gagal mengambil profil: ${response.body}");
    }
  }
}

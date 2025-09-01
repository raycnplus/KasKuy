import 'dart:convert';
import 'dart:io';
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
      headers: {"Accept": "application/json", "Authorization": "Bearer $token"},
    );

    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      final data = jsonResponse["data"];
      return User.fromJson(data);
    } else {
      throw Exception("Gagal mengambil profil: ${response.body}");
    }
  }

  static Future<String> updateProfilePicture(File imageFile) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString("token");

      if (token == null) {
        throw Exception("Token tidak ditemukan, harap login kembali.");
      }

      if (!await imageFile.exists()) {
        throw Exception("File tidak ditemukan.");
      }
      final fileSize = await imageFile.length();
      if (fileSize > 5 * 1024 * 1024) {
        throw Exception("Ukuran file terlalu besar (maks 5 MB).");
      }

      final url = Uri.parse("${ApiEndpoints.baseUrl}/user/profile-picture");

      final request = http.MultipartRequest("POST", url);
      request.headers["Authorization"] = "Bearer $token";
      request.files.add(
        await http.MultipartFile.fromPath("profile_picture", imageFile.path),
      );

      final streamedResponse = await request.send().timeout(
        const Duration(seconds: 30),
        onTimeout: () => throw Exception("Timeout saat upload foto"),
      );

      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse is Map &&
            jsonResponse.containsKey("profile_picture_url")) {
          return jsonResponse["profile_picture_url"];
        } else {
          throw Exception("Response tidak sesuai format: ${response.body}");
        }
      } else {
        throw Exception("Gagal update foto profil: ${response.body}");
      }
    } catch (e) {
      throw Exception("Terjadi kesalahan: $e");
    }
  }
}

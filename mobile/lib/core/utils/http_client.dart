import 'dart:convert';
import 'package:http/http.dart' as http;

class HttpClientHelper {
  static Future<Map<String, dynamic>> post(
    String url, {
    Map<String, dynamic>? body,
    Map<String, String>? headers,
    bool sendJson = true, // default kirim JSON
  }) async {
    final mergedHeaders = {
      'Accept': 'application/json',
      if (sendJson) 'Content-Type': 'application/json',
      ...?headers,
    };

    final response = await http.post(
      Uri.parse(url),
      headers: mergedHeaders,
      body: sendJson && body != null ? jsonEncode(body) : body,
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      throw Exception(
          jsonDecode(response.body)['message'] ?? 'Request error');
    }
  }
}

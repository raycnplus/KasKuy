import '/core/constants/api_endpoints.dart';
import '/core/utils/http_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static Future<String> sendOtp({
    required String name,
    required String username,
    required String phone,
    required String password,
  }) async {
    final result = await HttpClientHelper.post(
      ApiEndpoints.sendOtpForRegister,
      body: {
        'name': name,
        'username': username,
        'phone': phone,
        'password': password,
      },
    );
    return result['message'];
  }

  static Future<Map<String, dynamic>> verifyOtp({
    required String phone,
    required String otp,
  }) async {
    final result = await HttpClientHelper.post(
      ApiEndpoints.verifyOtpAndRegister,
      body: {'phone': phone, 'otp': otp},
    );
    return result;
  }

  static Future<Map<String, dynamic>> resendOtp({
    required String phone,
  }) async {
    final response = await HttpClientHelper.post(
      ApiEndpoints.resendOtp,
      body: {"phone": phone},
    );
    return response;
  }

  static Future<Map<String, dynamic>> login({
    required String phone,
    required String password,
  }) async {
    final result = await HttpClientHelper.post(
      ApiEndpoints.login,
      body: {
        'phone': phone,
        'password': password,
      },
    );

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', result['token']);

    return result;
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    if (token == null) return;

    await HttpClientHelper.post(
      ApiEndpoints.logout,
      headers: {
        'Authorization': 'Bearer $token',
      },
      sendJson: false, 
    );

    prefs.remove('token');
  }
}

class ApiEndpoints {
  static const String baseUrl = 'http://10.20.104.174:8000/api'; 
  static const String sendOtpForRegister = '$baseUrl/register';
  static const String verifyOtpAndRegister = '$baseUrl/register/verify';
  static const String resendOtp = "$baseUrl/resend-otp";
  static const String login = "$baseUrl/login";
  static const String logout = "$baseUrl/logout";
}

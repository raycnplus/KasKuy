class ApiEndpoints {
  static const String baseUrl = 'http://192.168.1.64:8000/api'; 
  static const String sendOtpForRegister = '$baseUrl/register';
  static const String verifyOtpAndRegister = '$baseUrl/register/verify';
  static const String resendOtp = "$baseUrl/resend-otp";
  static const String login = "$baseUrl/login";
  static const String logout = "$baseUrl/logout";
  static const String categories = "$baseUrl/category";
  static const String transactions = "$baseUrl/transaction";
  static const String forgotPwRequset = "$baseUrl/forgot-pw/request";
  static const String forgotPwVerify = "$baseUrl/forgot-pw/verify";
  static const String incomeCategories = "$baseUrl/category/IncomeCategory";
  static const String expenseCategories = "$baseUrl/category/ExpenseCategory";
  static const String userProfile = "$baseUrl/profile";
  static const String updateProfilePicture = "$baseUrl/user/profile-picture";
}

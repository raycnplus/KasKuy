import 'package:flutter/material.dart';
import '/data/services/auth_service.dart';
import 'home_page.dart';

class OtpPage extends StatefulWidget {
  final String phone;
  final String password; // tambahkan password

  const OtpPage({required this.phone, required this.password});

  @override
  _OtpPageState createState() => _OtpPageState();
}

class _OtpPageState extends State<OtpPage> {
  final otpController = TextEditingController();
  bool loading = false;

  Future<void> handleVerifyOtp() async {
    setState(() => loading = true);
    try {
      final result = await AuthService.verifyOtp(
        phone: widget.phone,
        otp: otpController.text,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Verifikasi berhasil')),
      );

      // Login otomatis
      await AuthService.login(
        phone: widget.phone,
        password: widget.password,
      );

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => HomePage()),
        (route) => false,
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Verifikasi OTP")),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: otpController,
              decoration: InputDecoration(labelText: "Masukkan OTP"),
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: loading ? null : handleVerifyOtp,
              child: loading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text("Verifikasi"),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '/data/services/auth_service.dart';
import 'verify_register_page.dart';

import 'package:intl_phone_field/intl_phone_field.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final nameCtrl = TextEditingController();
  final usernameCtrl = TextEditingController();
  final phoneCtrl = TextEditingController(); 
  final passCtrl = TextEditingController();

  bool loading = false;

  Future<void> handleRegister() async {
    setState(() => loading = true);
    try {
      final msg = await AuthService.sendOtp(
        name: nameCtrl.text,
        username: usernameCtrl.text,
        phone: phoneCtrl.text, // sudah format internasional
        password: passCtrl.text,
      );
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => OtpPage(
            phone: phoneCtrl.text, // pass nomor telepon
            password: passCtrl.text, // pass password
          ),
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Register Kaskuy")),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: SingleChildScrollView(
          child: Column(
            children: [
              TextField(controller: nameCtrl, decoration: InputDecoration(labelText: "Nama")),
              TextField(controller: usernameCtrl, decoration: InputDecoration(labelText: "Username")),
              SizedBox(height: 10),
              IntlPhoneField(
                decoration: InputDecoration(
                  labelText: 'Nomor Telepon',
                  border: OutlineInputBorder(),
                ),
                initialCountryCode: 'ID', 
                onChanged: (phone) {
                  phoneCtrl.text = phone.completeNumber; 
                },
              ),
              SizedBox(height: 10),
              TextField(
                controller: passCtrl,
                decoration: InputDecoration(labelText: "Password"),
                obscureText: true,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: loading ? null : handleRegister,
                child: loading
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text("Daftar & Kirim OTP"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
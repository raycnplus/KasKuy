import 'package:flutter/material.dart';
import '/data/services/auth_service.dart';
import 'home_page.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final phoneCtrl = TextEditingController();
  final passwordCtrl = TextEditingController();
  bool loading = false;

  String countryCode = "+62";

  Future<void> handleLogin() async {
    setState(() => loading = true);
    try {
      final fullPhone = "$countryCode${phoneCtrl.text.trim()}";

      final result = await AuthService.login(
        phone: fullPhone,
        password: passwordCtrl.text,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Login sukses')),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => HomePage()),
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
      appBar: AppBar(title: Text("Login")),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                // Dropdown kode negara
                DropdownButton<String>(
                  value: countryCode,
                  items: [
                    DropdownMenuItem(
                      value: "+62",
                      child: Text("+62 🇮🇩"),
                    ),
                    DropdownMenuItem(
                      value: "+60",
                      child: Text("+60 🇲🇾"),
                    ),
                    DropdownMenuItem(
                      value: "+65",
                      child: Text("+65 🇸🇬"),
                    ),
                  ],
                  onChanged: (value) {
                    setState(() {
                      countryCode = value!;
                    });
                  },
                ),
                SizedBox(width: 10),
                Expanded(
                  child: TextField(
                    controller: phoneCtrl,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: "Nomor Telepon",
                    ),
                  ),
                ),
              ],
            ),
            TextField(
              controller: passwordCtrl,
              decoration: InputDecoration(labelText: "Password"),
              obscureText: true,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: loading ? null : handleLogin,
              child: loading
                  ? CircularProgressIndicator(color: Colors.white)
                  : Text("Login"),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:mobile/presentation/pages/landing_page.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '/data/services/auth_service.dart';
import 'login_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  Future<void> _handleLogout(BuildContext context) async {
    try {
      await AuthService.logout();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Logout berhasil')),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => LandingPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal logout: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Kaskuy")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Selamat Datang di Kaskuy",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _handleLogout(context),
              child: Text("Logout"),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:mobile/presentation/pages/category/category_page.dart';
import 'package:mobile/presentation/pages/landing_page.dart';
import 'package:mobile/presentation/pages/transaction/transaction_page.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '/data/services/auth_service.dart';
import 'login_page.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class HomePage extends StatelessWidget {
  const HomePage({super.key});
  Future<void> _handleLogout(BuildContext context) async {
    try {
      await AuthService.logout();
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Logout berhasil')));
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LandingPage()),
      );
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Gagal logout: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Kaskuy")),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "Selamat Datang di Kaskuy",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const CategoryPage()),
                );
              },
              icon: const Icon(Icons.category),
              label: const Text("Kelola Kategori"),
            ),
            const SizedBox(height: 10),
            ElevatedButton.icon(
              onPressed: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const TransactionPage()),
                );
              },
              icon: const Icon(Icons.swap_horiz),
              label: const Text("Kelola Transaksi"),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () => _handleLogout(context),
              child: const Text("Logout"),
            ),
          ],
        ),
      ),
    );
  }
}

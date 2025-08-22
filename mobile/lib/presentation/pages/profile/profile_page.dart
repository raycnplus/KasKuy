import 'package:flutter/material.dart';
import '/data/services/profile_service.dart';
import '/models/user_model.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  User? profile;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final result = await ProfileService.getProfile();
      setState(() {
        profile = result;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    }
  }

  String _maskPassword(String password) {
    return "*" * password.length;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profil")),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : profile == null
              ? const Center(child: Text("Gagal memuat profil"))
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CircleAvatar(
                        radius: 50,
                        backgroundImage: profile!.profilePictureUrl != null
                            ? NetworkImage(profile!.profilePictureUrl!)
                            : null,
                        child: profile!.profilePictureUrl == null
                            ? const Icon(Icons.account_circle, size: 100)
                            : null,
                      ),
                      const SizedBox(height: 20),
                      Text("Nama: ${profile!.name}", style: const TextStyle(fontSize: 18)),
                      Text("Username: ${profile!.username}", style: const TextStyle(fontSize: 18)),
                      Text("No Telp: ${profile!.phone}", style: const TextStyle(fontSize: 18)),
                      Text("Password: ${_maskPassword("12345678")}", style: const TextStyle(fontSize: 18)), // hanya contoh
                    ],
                  ),
                ),
    );
  }
}

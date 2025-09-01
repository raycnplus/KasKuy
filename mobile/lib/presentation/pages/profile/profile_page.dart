import 'dart:io';

import 'package:flutter/material.dart';
import '/data/services/profile_service.dart';
import '/models/user_model.dart';
import 'package:image_picker/image_picker.dart';

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
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Error: $e")));
    }
  }

  String _maskPassword(String password) {
    return "*" * password.length;
  }

  Widget _buildInfoTile(String title, String value, {IconData? icon}) {
    return Column(
      children: [
        ListTile(
          leading: Icon(icon ?? Icons.info_outline),
          title: Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          subtitle: Text(value, style: const TextStyle(fontSize: 16)),
        ),
        const Divider(),
      ],
    );
  }

  Future<void> _changeProfilePicture() async {
    final picker = ImagePicker();

    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text("Kamera"),
              onTap: () => Navigator.pop(context, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text("Galeri"),
              onTap: () => Navigator.pop(context, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );

    if (source == null) return; 

    final pickedFile = await picker.pickImage(source: source, imageQuality: 80);

    if (pickedFile == null) return; 

    final imageFile = File(pickedFile.path);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(child: CircularProgressIndicator()),
    );

    try {
      final newUrl = await ProfileService.updateProfilePicture(imageFile);

      setState(() {
        profile = profile?.copyWith(profilePictureUrl: newUrl);
      });

      Navigator.pop(context); 
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Foto profil berhasil diperbarui")),
      );
    } catch (e) {
      Navigator.pop(context);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Gagal update foto: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profil"), backgroundColor: Colors.teal),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : profile == null
          ? const Center(child: Text("Gagal memuat profil"))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Center(
                    child: Stack(
                      children: [
                        CircleAvatar(
                          radius: 60,
                          backgroundImage: profile!.profilePictureUrl != null
                              ? NetworkImage(profile!.profilePictureUrl!)
                              : null,
                          child: profile!.profilePictureUrl == null
                              ? const Icon(Icons.account_circle, size: 100)
                              : null,
                        ),
                        Positioned(
                          bottom: 0,
                          right: 4,
                          child: CircleAvatar(
                            backgroundColor: Colors.teal,
                            child: IconButton(
                              icon: const Icon(
                                Icons.camera_alt,
                                color: Colors.white,
                              ),
                              onPressed: _changeProfilePicture,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Card(
                    elevation: 3,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        _buildInfoTile(
                          "Nama",
                          profile!.name,
                          icon: Icons.person,
                        ),
                        _buildInfoTile(
                          "Username",
                          profile!.username,
                          icon: Icons.badge,
                        ),
                        _buildInfoTile(
                          "No. Telepon",
                          profile!.phone ?? "-",
                          icon: Icons.phone,
                        ),
                        _buildInfoTile(
                          "Password",
                          _maskPassword("12345678"),
                          icon: Icons.lock,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

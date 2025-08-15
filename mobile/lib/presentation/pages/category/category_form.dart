import 'package:flutter/material.dart';
import 'package:emoji_picker_flutter/emoji_picker_flutter.dart';
import '/data/services/category_service.dart';
import '/models/category_model.dart' as mymodel;

class CategoryFormPage extends StatefulWidget {
  final mymodel.Category? category;

  const CategoryFormPage({Key? key, this.category}) : super(key: key);

  @override
  State<CategoryFormPage> createState() => _CategoryFormPageState();
}

class _CategoryFormPageState extends State<CategoryFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _iconController = TextEditingController();

  String? _selectedType;
  String? _selectedPriority;
  bool _isLoading = false;

  final List<String> _typeOptions = ['Pemasukan', 'Pengeluaran'];
  final List<String> _priorityOptions = ['Low', 'Medium', 'High'];

  @override
  void initState() {
    super.initState();
    if (widget.category != null) {
      _nameController.text = widget.category!.name;
      _iconController.text = widget.category!.icon;
      _selectedType = widget.category!.type;
      _selectedPriority = widget.category!.priority;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _iconController.dispose();
    super.dispose();
  }

  Future<void> _saveCategory() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final success = widget.category == null
        ? await CategoryService.createCategory(
            name: _nameController.text,
            icon: _iconController.text,
            type: _selectedType!,
            priority: _selectedType == 'Pengeluaran' ? _selectedPriority : null,
          )
        : await CategoryService.updateCategory(
            id: widget.category!.id,
            name: _nameController.text,
            icon: _iconController.text,
            type: _selectedType!,
            priority: _selectedType == 'Pengeluaran' ? _selectedPriority : null,
          );

    setState(() => _isLoading = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.category == null
                ? 'Kategori berhasil dibuat'
                : 'Kategori berhasil diperbarui',
          ),
        ),
      );
      Navigator.pop(context, true);
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Gagal menyimpan kategori')));
    }
  }

  Future<void> _pickEmoji() async {
    final selectedEmoji = await showModalBottomSheet<String>(
      context: context,
      showDragHandle: true,
      builder: (_) {
        return SafeArea(
          child: SizedBox(
            height: 320,
            child: EmojiPicker(
              onEmojiSelected: (category, emoji) {
                Navigator.pop(context, emoji.emoji);
              },
              config: Config(
                emojiViewConfig: const EmojiViewConfig(columns: 7),
              ),
            ),
          ),
        );
      },
    );

    if (selectedEmoji != null) {
      setState(() => _iconController.text = selectedEmoji);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.category != null;

    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? 'Edit Kategori' : 'Tambah Kategori')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(labelText: 'Nama Kategori'),
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Wajib diisi' : null,
              ),

              TextFormField(
                controller: _iconController,
                readOnly: true,
                decoration: InputDecoration(
                  labelText: 'Icon (Emoji)',
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.emoji_emotions_outlined),
                    onPressed: _pickEmoji,
                  ),
                ),
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Wajib diisi' : null,
              ),

              DropdownButtonFormField<String>(
                value: _selectedType,
                decoration: const InputDecoration(labelText: 'Type'),
                items: _typeOptions
                    .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                    .toList(),
                onChanged: (v) {
                  setState(() {
                    _selectedType = v;
                    if (_selectedType != 'Pengeluaran') {
                      _selectedPriority = null;
                    }
                  });
                },
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Wajib dipilih' : null,
              ),

              if (_selectedType == 'Pengeluaran')
                DropdownButtonFormField<String>(
                  value: _selectedPriority,
                  decoration: const InputDecoration(labelText: 'Priority'),
                  items: _priorityOptions
                      .map((p) => DropdownMenuItem(value: p, child: Text(p)))
                      .toList(),
                  onChanged: (v) => setState(() => _selectedPriority = v),
                  validator: (v) {
                    if (_selectedType == 'Pengeluaran' &&
                        (v == null || v.isEmpty)) {
                      return 'Wajib dipilih';
                    }
                    return null;
                  },
                ),

              const SizedBox(height: 20),

              ElevatedButton(
                onPressed: _isLoading ? null : _saveCategory,
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Text(isEdit ? 'Update' : 'Create'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

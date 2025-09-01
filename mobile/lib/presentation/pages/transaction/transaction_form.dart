import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '/models/transaction_model.dart';
import '/data/services/transaction_service.dart';
import '/models/category_model.dart';
import '/data/services/category_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TransactionForm extends StatefulWidget {
  final Transaction? transaction;
  const TransactionForm({super.key, this.transaction});

  @override
  State<TransactionForm> createState() => _TransactionFormState();
}

class _TransactionFormState extends State<TransactionForm> {
  final _formKey = GlobalKey<FormState>();

  String _type = "Pengeluaran";
  int? _categoryId;

  late TextEditingController _amountController;
  late TextEditingController _descriptionController;
  late TextEditingController _dateController;

  List<Category> _categories = [];

  final NumberFormat _formatter = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );

  int _rawAmount = 0;

  @override
  void initState() {
    super.initState();
    _type = widget.transaction?.type ?? "Pengeluaran";
    _categoryId = widget.transaction?.categoryId;
    _rawAmount = widget.transaction?.amount ?? 0;

    _amountController = TextEditingController(
      text: _rawAmount > 0 ? _formatter.format(_rawAmount) : '',
    );
    _descriptionController = TextEditingController(
      text: widget.transaction?.description ?? '',
    );

    // kalau ada transaksi lama, parse tanggalnya
    String dateText = widget.transaction?.date ?? DateTime.now().toString().split(" ")[0];
    _dateController = TextEditingController(
      text: DateFormat("dd MMM yyyy", "id_ID").format(DateTime.parse(dateText)),
    );

    _loadCategories();
  }

  Future<void> _loadCategories() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token") ?? "";

    try {
      List<Category> cats = [];
      if (_type == "Pemasukan") {
        cats = await CategoryService.getIncomeCategories(token);
      } else {
        cats = await CategoryService.getExpenseCategories(token);
      }

      setState(() {
        _categories = cats;
        if (!_categories.any((c) => c.id == _categoryId)) {
          _categoryId = null;
        }
      });
    } catch (e) {
      print("Error loadCategories: $e");
    }
  }

  void _save() async {
    if (_formKey.currentState!.validate()) {
      // parsing kembali ke format backend (yyyy-MM-dd)
      DateTime parsed = DateFormat("dd MMM yyyy", "id_ID").parse(_dateController.text);
      String backendDate = DateFormat("yyyy-MM-dd").format(parsed);

      final trx = Transaction(
        id: widget.transaction?.id ?? 0,
        type: _type,
        amount: _rawAmount,
        description: _descriptionController.text,
        date: backendDate,
        categoryId: _categoryId!,
        categoryName: '',
        categoryIcon: '',
      );

      final service = TransactionService();
      if (widget.transaction == null) {
        await service.createTransaction(trx);
      } else {
        await service.updateTransaction(widget.transaction!.id, trx);
      }

      if (mounted) Navigator.pop(context, true);
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Catat Transaksi"),
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Toggle tipe transaksi
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ChoiceChip(
                  label: const Text("Pengeluaran"),
                  selected: _type == "Pengeluaran",
                  selectedColor: Colors.red.shade100,
                  onSelected: (_) {
                    setState(() => _type = "Pengeluaran");
                    _loadCategories();
                  },
                  labelStyle: TextStyle(
                    color: _type == "Pengeluaran" ? Colors.red : Colors.black,
                  ),
                ),
                const SizedBox(width: 10),
                ChoiceChip(
                  label: const Text("Pemasukan"),
                  selected: _type == "Pemasukan",
                  selectedColor: Colors.green.shade100,
                  onSelected: (_) {
                    setState(() => _type = "Pemasukan");
                    _loadCategories();
                  },
                  labelStyle: TextStyle(
                    color: _type == "Pemasukan" ? Colors.green : Colors.black,
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Tanggal dengan DatePicker
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: TextFormField(
                    controller: _dateController,
                    readOnly: true,
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      hintText: "Tanggal",
                    ),
                    onTap: () async {
                      DateTime? pickedDate = await showDatePicker(
                        context: context,
                        initialDate: DateTime.tryParse(
                              DateFormat("yyyy-MM-dd").format(DateTime.now()),
                            ) ??
                            DateTime.now(),
                        firstDate: DateTime(2000),
                        lastDate: DateTime(2100),
                        locale: const Locale("id", "ID"),
                      );

                      if (pickedDate != null) {
                        setState(() {
                          _dateController.text =
                              DateFormat("dd MMM yyyy", "id_ID").format(pickedDate);
                        });
                      }
                    },
                  ),
                ),
              ],
            ),

            const Divider(),

            // Jumlah
            Center(
              child: TextFormField(
                controller: _amountController,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  hintText: "Rp 0",
                  border: InputBorder.none,
                ),
                validator: (val) => _rawAmount == 0 ? "Isi jumlah" : null,
                onChanged: (val) {
                  String digits = val.replaceAll(RegExp(r'[^0-9]'), '');
                  if (digits.isEmpty) digits = "0";
                  _rawAmount = int.parse(digits);

                  _amountController.value = TextEditingValue(
                    text: _formatter.format(_rawAmount),
                    selection: TextSelection.collapsed(
                      offset: _formatter.format(_rawAmount).length,
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // Deskripsi
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                hintText: "Tulis keterangan transaksi kalo perlu",
                border: OutlineInputBorder(),
              ),
            ),

            const SizedBox(height: 16),

            // Pilih kategori
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _categories.map((c) {
                final selected = _categoryId == c.id;
                return ChoiceChip(
                  label: Text("${c.icon} ${c.name}"),
                  selected: selected,
                  onSelected: (_) => setState(() => _categoryId = c.id),
                );
              }).toList(),
            ),

            const SizedBox(height: 24),

            // Tombol simpan
            ElevatedButton(
              onPressed: _save,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: _type == "Pengeluaran"
                    ? Colors.red
                    : Colors.green,
              ),
              child: Text(
                _type == "Pengeluaran"
                    ? "Catat Pengeluaran"
                    : "Catat Pemasukan",
                style: const TextStyle(fontSize: 16, color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

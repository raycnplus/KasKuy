import 'package:flutter/material.dart';
import '/models/transaction_model.dart';
import '/data/services/transaction_service.dart';
import 'transaction_form.dart';

class TransactionPage extends StatefulWidget {
  const TransactionPage({super.key});

  @override
  State<TransactionPage> createState() => _TransactionPageState();
}

class _TransactionPageState extends State<TransactionPage> {
  late Future<List<Transaction>> _transactions;

  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  /// Ambil data transaksi dari service
  void _loadTransactions() {
    _transactions = TransactionService().getTransactions();
  }

  /// Buka form tambah/edit
  Future<void> _openForm([Transaction? trx]) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => TransactionForm(transaction: trx),
      ),
    );

    // jika pop(context, true) -> refresh list
    if (result == true) {
      setState(() {
        _loadTransactions();
      });
    }
  }

  /// Hapus transaksi
  Future<void> _deleteTransaction(int id) async {
    await TransactionService().deleteTransaction(id);
    setState(() {
      _loadTransactions();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Transaksi")),
      body: FutureBuilder<List<Transaction>>(
        future: _transactions,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("Belum ada transaksi"));
          }

          final data = snapshot.data!;
          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _loadTransactions();
              });
            },
            child: ListView.builder(
              itemCount: data.length,
              itemBuilder: (context, i) {
                final trx = data[i];
                return ListTile(
                  leading: Text(
                    trx.categoryIcon,
                    style: const TextStyle(fontSize: 22),
                  ),
                  title: Text("${trx.categoryName} - ${trx.amount}"),
                  subtitle: Text("${trx.type} | ${trx.date}"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => _openForm(trx),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () => _deleteTransaction(trx.id),
                      ),
                    ],
                  ),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openForm(),
        child: const Icon(Icons.add),
      ),
    );
  }
}

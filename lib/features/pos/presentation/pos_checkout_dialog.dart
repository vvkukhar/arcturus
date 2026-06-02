import 'package:flutter/material.dart';

class PosCheckoutDialog extends StatelessWidget {
  final double total;
  final VoidCallback onCard;
  final VoidCallback onCash;
  final VoidCallback onCrypto;

  const PosCheckoutDialog({super.key, required this.total, required this.onCard, required this.onCash, required this.onCrypto});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      backgroundColor: const Color(0xFF171A21),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Total Due', style: TextStyle(color: Colors.white54, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5)),
            const SizedBox(height: 8),
            Text('$total ₴', style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: Colors.white)),
            const SizedBox(height: 32),
            _PayBtn('Terminal (Card)', Icons.credit_card, Colors.blueAccent, () { Navigator.pop(context); onCard(); }),
            const SizedBox(height: 12),
            _PayBtn('Cash', Icons.payments_outlined, Colors.green, () { Navigator.pop(context); onCash(); }),
            const SizedBox(height: 12),
            _PayBtn('Crypto Pay', Icons.currency_bitcoin, Colors.orangeAccent, () { Navigator.pop(context); onCrypto(); }),
          ],
        ),
      ),
    );
  }
}

class _PayBtn extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _PayBtn(this.label, this.icon, this.color, this.onTap);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: FilledButton.icon(
        style: FilledButton.styleFrom(backgroundColor: color, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
        onPressed: onTap,
        icon: Icon(icon, color: Colors.white),
        label: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white)),
      ),
    );
  }
}
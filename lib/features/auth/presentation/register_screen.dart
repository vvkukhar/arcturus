import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/router/app_router.dart';
import 'package:lego_trading_manager/features/auth/application/auth_engine.dart';
import 'package:lego_trading_manager/core/i18n/i18n_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _inviteCode = TextEditingController();
  bool _isLoading = false;

  void _register() async {
    if (_name.text.isEmpty || _email.text.isEmpty || _password.text.isEmpty || _inviteCode.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('All fields are required'), backgroundColor: Colors.orange));
      return;
    }

    setState(() => _isLoading = true);
    try {
      await ref.read(authEngineProvider.notifier).register(_name.text, _email.text, _password.text, _inviteCode.text);
      if (mounted) Navigator.pushReplacementNamed(context, AppRouter.dashboard);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Registration failed: $e'), backgroundColor: Colors.redAccent));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final i18n = ref.watch(i18nProvider.notifier);

    return Scaffold(
      backgroundColor: const Color(0xFF0D0F14),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(32),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(i18n.t('auth.regTitle'), style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white)),
                Text(i18n.t('auth.regSub'), style: const TextStyle(color: Colors.white54)),
                const SizedBox(height: 48),
                TextField(
                  controller: _name,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: i18n.t('auth.name'),
                    prefixIcon: const Icon(Icons.person_outline, color: Colors.white54),
                    filled: true,
                    fillColor: Colors.white.withValues(alpha: 0.05),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _email,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: i18n.t('auth.email'),
                    prefixIcon: const Icon(Icons.email_outlined, color: Colors.white54),
                    filled: true,
                    fillColor: Colors.white.withValues(alpha: 0.05),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _password,
                  obscureText: true,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: '${i18n.t('auth.password')} (min 6 chars)',
                    prefixIcon: const Icon(Icons.lock_outline, color: Colors.white54),
                    filled: true,
                    fillColor: Colors.white.withValues(alpha: 0.05),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _inviteCode,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: i18n.t('auth.inviteCode'),
                    prefixIcon: const Icon(Icons.vpn_key_outlined, color: Colors.white54),
                    filled: true,
                    fillColor: Colors.white.withValues(alpha: 0.05),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                  ),
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: FilledButton(
                    onPressed: _isLoading ? null : _register,
                    style: FilledButton.styleFrom(backgroundColor: Colors.blueAccent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                    child: _isLoading ? const CircularProgressIndicator(color: Colors.white) : Text(i18n.t('auth.register'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
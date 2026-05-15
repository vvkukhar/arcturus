import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:lego_trading_manager/core/network/network_core.dart';
import 'package:lego_trading_manager/core/sync/sync_engine.dart';

class AuthEngineState {
  final bool isAuthenticated;
  final bool isOfflineMode;
  final Map<String, dynamic>? user;
  const AuthEngineState({this.isAuthenticated = false, this.isOfflineMode = false, this.user});
}

class AuthEngine extends AsyncNotifier<AuthEngineState> {
  @override
  Future<AuthEngineState> build() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('arcturus_jwt');
    final cookie = prefs.getString('arcturus_cookie');
    final offline = prefs.getString('arcturus_offline') == 'true';

    if (offline) return const AuthEngineState(isAuthenticated: true, isOfflineMode: true);
    
    if (token != null || cookie != null) {
      try {
        final res = await ref.read(networkCoreProvider).request('GET', '/auth/me');
        return AuthEngineState(isAuthenticated: true, user: res);
      } catch (e) {
        await prefs.remove('arcturus_jwt');
        await prefs.remove('arcturus_cookie');
        return const AuthEngineState();
      }
    }
    return const AuthEngineState();
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final res = await ref.read(networkCoreProvider).request('POST', '/auth/login', body: {
        'email': email,
        'password': password,
      });

      if (res == null) throw Exception('Empty response from server');

      String? token;
      Map<String, dynamic>? user;

      if (res is String) {
        token = res;
      } else if (res is Map) {
        token = res['token'] ?? res['access_token'] ?? res['accessToken'] ?? res['jwt'];
        user = res['user'];
      }

      final prefs = await SharedPreferences.getInstance();
      
      if (user != null || (token != null && token.isNotEmpty) || prefs.getString('arcturus_cookie') != null) {
        await prefs.setString('arcturus_jwt', token ?? 'cookie_session_active');
        await ref.read(networkCoreProvider).initSocket();
        state = AsyncValue.data(AuthEngineState(isAuthenticated: true, user: user ?? (res is Map ? Map<String, dynamic>.from(res) : null)));
      } else {
        throw Exception('Server replied: $res');
      }
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      throw Exception(e.toString().replaceAll('Exception: ', ''));
    }
  }

  Future<void> register(String name, String email, String password, String inviteCode) async {
    state = const AsyncValue.loading();
    try {
      final res = await ref.read(networkCoreProvider).request('POST', '/auth/register', body: {
        'name': name,
        'email': email,
        'password': password,
        'inviteCode': inviteCode,
      });

      String? token;
      Map<String, dynamic>? user;
      
      if (res is String) {
        token = res;
      } else if (res is Map) {
        token = res['token'] ?? res['access_token'] ?? res['accessToken'] ?? res['jwt'];
        user = res['user'];
      }

      final prefs = await SharedPreferences.getInstance();

      if (user != null || (token != null && token.isNotEmpty) || prefs.getString('arcturus_cookie') != null) {
        await prefs.setString('arcturus_jwt', token ?? 'cookie_session_active');
        await ref.read(networkCoreProvider).initSocket();
        state = AsyncValue.data(AuthEngineState(isAuthenticated: true, user: user));
      } else {
        await login(email, password);
      }
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      throw Exception(e.toString().replaceAll('Exception: ', '')); 
    }
  }

  Future<void> enableOfflineMode() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('arcturus_offline', 'true');
    ref.read(syncEngineProvider.notifier).setOfflineMode();
    state = const AsyncValue.data(AuthEngineState(isAuthenticated: true, isOfflineMode: true));
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('arcturus_jwt');
    await prefs.remove('arcturus_cookie');
    await prefs.remove('arcturus_offline');
    ref.read(networkCoreProvider).dispose();
    state = const AsyncValue.data(AuthEngineState());
  }
}

final authEngineProvider = AsyncNotifierProvider<AuthEngine, AuthEngineState>(AuthEngine.new);
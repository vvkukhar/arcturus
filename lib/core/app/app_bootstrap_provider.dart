import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/app/providers/repositories_providers.dart';

final appBootstrapProvider = FutureProvider<void>((ref) async {
  // Просто імітуємо ініціалізацію для сумісності з AppBootstrapScreen, 
  // оскільки дані тепер тягнуться локально з репозиторіїв або кешу Riverpod AsycNotifier'ів
  await Future.delayed(const Duration(milliseconds: 500));
  
  // Додатково ініціалізуємо репозиторії, якщо вони потребують асинхронного завантаження
  ref.read(inventoryRepositoryProvider);
  ref.read(watchlistRepositoryProvider);
});
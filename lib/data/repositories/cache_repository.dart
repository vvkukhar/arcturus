// lib/data/repositories/cache_repository.dart

abstract class AbstractCacheDatasource {
  Future<String?> get(String key);
  Future<void> set(String key, String value);
  Future<void> delete(String key);
}

class CacheRepository {
  final AbstractCacheDatasource datasource;

  CacheRepository(this.datasource);

  Future<String?> get(String key) => datasource.get(key);

  Future<void> set(String key, String value) => datasource.set(key, value);

  Future<void> delete(String key) => datasource.delete(key);
}

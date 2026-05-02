// lib/data/datasources/abstract_cache_datasource.dart

abstract class AbstractCacheDatasource {
  Future<String?> get(String key);
  Future<void> set(String key, String value);
  Future<void> delete(String key);
}

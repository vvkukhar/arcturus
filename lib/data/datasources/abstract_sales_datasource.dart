// lib/data/datasources/abstract_sales_datasource.dart

import 'package:lego_trading_manager/data/models/sale_model.dart';

abstract class AbstractSalesDatasource {
  Future<List<SaleModel>> getAllSales();
  Future<SaleModel?> getByItemId(String itemId);
  Future<void> addSale(SaleModel sale);
  Future<void> updateSale(SaleModel sale);
  Future<void> deleteSale(String id);
}

import 'package:flutter/foundation.dart';
import 'package:path/path.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';

class AppDatabase {
  Database? _database;

  Future<Database> get instance async {
    if (_database != null) {
      return _database!;
    }

    if (kIsWeb) {
      databaseFactory = databaseFactoryFfiWeb;
    } else if (defaultTargetPlatform == TargetPlatform.windows ||
        defaultTargetPlatform == TargetPlatform.linux ||
        defaultTargetPlatform == TargetPlatform.macOS) {
      sqfliteFfiInit();
      databaseFactory = databaseFactoryFfi;
    }

    final databasesPath = await getDatabasesPath();
    final dbPath = join(databasesPath, 'arcturus_crm.db');

    _database = await openDatabase(
      dbPath,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE cache_entries (
            cache_key TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            updated_at TEXT NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE sync_queue (
            id TEXT PRIMARY KEY,
            queue_type TEXT NOT NULL,
            endpoint TEXT NOT NULL,
            method TEXT NOT NULL,
            body_json TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            retry_count INTEGER NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE conflict_entries (
            id TEXT PRIMARY KEY,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            local_json TEXT NOT NULL,
            remote_json TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE inventory_items (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            theme TEXT,
            subtheme TEXT,
            legoNumber TEXT,
            minifigId TEXT,
            setId TEXT,
            condition TEXT NOT NULL,
            completeness TEXT NOT NULL,
            ownershipType TEXT NOT NULL,
            purchasePrice REAL NOT NULL,
            shippingToMe REAL NOT NULL,
            extraCosts REAL NOT NULL,
            totalCost REAL NOT NULL,
            marketLow REAL,
            marketAverage REAL,
            expectedSalePrice REAL,
            actualSalePrice REAL,
            platformBought TEXT,
            platformSold TEXT,
            status TEXT NOT NULL,
            purchaseDate TEXT,
            saleDate TEXT,
            notes TEXT,
            tags TEXT NOT NULL,
            photos TEXT NOT NULL,
            isTracked INTEGER NOT NULL,
            quantity INTEGER NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE purchases (
            id TEXT PRIMARY KEY,
            itemId TEXT NOT NULL,
            source TEXT NOT NULL,
            sourceUrl TEXT,
            sellerName TEXT,
            sellerContact TEXT,
            purchasePrice REAL NOT NULL,
            shippingCost REAL NOT NULL,
            additionalCosts REAL NOT NULL,
            finalTotal REAL NOT NULL,
            currency TEXT NOT NULL,
            exchangeRate REAL NOT NULL,
            paymentMethod TEXT NOT NULL,
            purchaseDate TEXT NOT NULL,
            note TEXT,
            quantity INTEGER NOT NULL,
            soldQuantity INTEGER NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE sales (
            id TEXT PRIMARY KEY,
            itemId TEXT NOT NULL,
            platform TEXT NOT NULL,
            buyerName TEXT,
            salePrice REAL NOT NULL,
            platformFee REAL NOT NULL,
            shippingPaidByMe REAL NOT NULL,
            shippingPaidByBuyer REAL NOT NULL,
            finalNet REAL NOT NULL,
            currency TEXT NOT NULL,
            saleDate TEXT NOT NULL,
            note TEXT,
            quantity INTEGER NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE watchlist (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            theme TEXT,
            refId TEXT,
            desiredBuyPrice REAL NOT NULL,
            maxBuyPrice REAL NOT NULL,
            marketPrice REAL,
            comment TEXT,
            createdAt TEXT NOT NULL,
            isActive INTEGER NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE market_snapshots (
            id TEXT PRIMARY KEY,
            itemRef TEXT NOT NULL,
            source TEXT NOT NULL,
            lowPrice REAL NOT NULL,
            averagePrice REAL NOT NULL,
            highPrice REAL NOT NULL,
            currency TEXT NOT NULL,
            sellerCount INTEGER,
            availableQty INTEGER,
            capturedAt TEXT NOT NULL,
            url TEXT
          )
        ''');

        await db.execute('''
          CREATE TABLE partout_projects (
            id TEXT PRIMARY KEY,
            sourceSetId TEXT NOT NULL,
            sourceSetTitle TEXT NOT NULL,
            purchaseCost REAL NOT NULL,
            shippingCost REAL NOT NULL,
            extraCosts REAL NOT NULL,
            totalCost REAL NOT NULL,
            expectedPartOutValue REAL NOT NULL,
            actualPartOutValue REAL NOT NULL,
            status TEXT NOT NULL,
            notes TEXT,
            createdAt TEXT NOT NULL
          )
        ''');

        await db.execute('''
          CREATE TABLE partout_lines (
            id TEXT PRIMARY KEY,
            projectId TEXT NOT NULL,
            itemType TEXT NOT NULL,
            itemRef TEXT,
            title TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            expectedUnitPrice REAL NOT NULL,
            expectedTotalPrice REAL NOT NULL,
            actualTotalPrice REAL NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (projectId) REFERENCES partout_projects(id) ON DELETE CASCADE
          )
        ''');
      },
    );

    return _database!;
  }
}
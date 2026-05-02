extension IterableNumX on Iterable<num> {
  double get sumDouble {
    return fold<double>(0, (sum, item) => sum + item.toDouble());
  }

  double get averageDouble {
    if (isEmpty) return 0;
    return sumDouble / length;
  }
}

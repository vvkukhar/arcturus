import 'package:flutter/material.dart';

class WatchlistPriorityExplainerCard extends StatelessWidget {
  const WatchlistPriorityExplainerCard({super.key});

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'How priority score works',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 16,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Higher score means stronger buy priority. '
              'The score increases when the item is active, has better value gap, '
              'and has stronger spread between desired and max price.',
            ),
          ],
        ),
      ),
    );
  }
}
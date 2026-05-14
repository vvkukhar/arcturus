import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lego_trading_manager/features/command_center/application/command_center_engine.dart';

class CommandCenterScreen extends ConsumerWidget {
  const CommandCenterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(commandCenterEngineProvider);
    final engine = ref.read(commandCenterEngineProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('Command Center', style: TextStyle(fontWeight: FontWeight.w900))),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: TextField(
                onChanged: engine.search,
                decoration: InputDecoration(
                  hintText: 'Search operations...',
                  prefixIcon: const Icon(Icons.search),
                  filled: true,
                  fillColor: const Color(0xFF171A21),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final section = state.visibleSections[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(section.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blueAccent)),
                        const SizedBox(height: 12),
                        Container(
                          decoration: BoxDecoration(color: const Color(0xFF171A21), borderRadius: BorderRadius.circular(16)),
                          child: Column(
                            children: section.actions.map((action) => ListTile(
                              title: Text(action.title, style: const TextStyle(fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                              subtitle: Text(action.subtitle, style: const TextStyle(color: Colors.white70), maxLines: 1, overflow: TextOverflow.ellipsis),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (action.badgeCount != null && action.badgeCount! > 0)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(color: Colors.white10, borderRadius: BorderRadius.circular(12)),
                                      child: Text(action.badgeCount! > 999 ? '999+' : action.badgeCount.toString(), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                                    ),
                                  const SizedBox(width: 8),
                                  const Icon(Icons.chevron_right, color: Colors.white30),
                                ],
                              ),
                              onTap: () => Navigator.pushNamed(context, action.route),
                            )).toList(),
                          ),
                        ),
                      ],
                    ),
                  );
                },
                childCount: state.visibleSections.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
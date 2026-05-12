import 'package:url_launcher/url_launcher.dart';

class LiqPayLauncher {
  static Future<void> openPayment(String data, String signature) async {
    final url = Uri.parse(
      'https://www.liqpay.ua/api/3/checkout?data=$data&signature=$signature'
    );
    
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } else {
      throw 'Could not launch LiqPay';
    }
  }
}
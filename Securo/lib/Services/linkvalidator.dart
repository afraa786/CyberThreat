import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:math' as math;
import 'package:flutter/services.dart';
import 'package:tflite_flutter/tflite_flutter.dart';

class LinkValidator {
  late Interpreter _interpreter;
  late Map<String, int> _vocab;
  late List<double> _idf;
  late int _featureCount;
  late int _ngramMin;
  late int _ngramMax;
  late bool _lowercase;
  bool _ready = false;

  Future<void> init() async {
    // Load TFLite model
    _interpreter = await Interpreter.fromAsset('assets/phishing_model.tflite');

    // Load metadata JSON
    final metaStr = await rootBundle.loadString('assets/tfidf_data.json');
    final meta = jsonDecode(metaStr) as Map<String, dynamic>;

    // Parse vocab + idf
    final vocabDynamic = meta['vocab'] as Map<String, dynamic>;
    _vocab = vocabDynamic.map((k, v) => MapEntry(k, (v as num).toInt()));
    _idf = (meta['idf'] as List).map((e) => (e as num).toDouble()).toList();

    // Parameters
    _featureCount = (meta['feature_count'] as num).toInt();
    _ngramMin = (meta['ngram_min'] as num).toInt();
    _ngramMax = (meta['ngram_max'] as num).toInt();
    _lowercase = meta['lowercase'] == true;

    if (_idf.length != _featureCount) {
      throw Exception('IDF length ${_idf.length} != feature_count $_featureCount');
    }

    _ready = true;
  }

  // Convert URL into TF-IDF vector
  List<double> _vectorize(String url) {
    if (!_ready) throw StateError('PhishingDetector not initialized');

    String s = url.trim();
    if (_lowercase) s = s.toLowerCase();

    final counts = List<double>.filled(_featureCount, 0.0);

    // Build n-grams
    for (int n = _ngramMin; n <= _ngramMax; n++) {
      if (s.length < n) continue;
      for (int i = 0; i <= s.length - n; i++) {
        final tok = s.substring(i, i + n);
        final idx = _vocab[tok];
        if (idx != null) counts[idx] += 1.0;
      }
    }

    // Apply IDF
    double sumSquares = 0.0;
    for (int j = 0; j < _featureCount; j++) {
      if (counts[j] != 0.0) {
        counts[j] = counts[j] * _idf[j];
        sumSquares += counts[j] * counts[j];
      }
    }

    // L2 normalize
    final norm = math.sqrt(sumSquares);
    if (norm > 0) {
      for (int j = 0; j < _featureCount; j++) {
        if (counts[j] != 0.0) counts[j] /= norm;
      }
    }

    return counts;
  }

  /// Returns probability in [0,1]
  double predict(String url) {
    final features = _vectorize(url);

    final input = [features];       // shape [1, 5000]
    final output = [
      [0.0]
    ];                              // shape [1, 1]

    _interpreter.run(input, output);
    return (output[0][0] as double);
  }

  String classify(String url, {double threshold = 0.5}) {
    final p = predict(url);
    return p >= threshold ? '⚠️ Phishing (score: $p)' : '✅ Safe (score: $p)';
  }
}
//
// class LinkValidator{
//   static Future<bool> checklink(String url) async{
//
//     try{
//       final response = await http.post(Uri.parse("https://official-joke-api.appspot.com/random_joke"),
//         );
//
//       if(response.statusCode==200){
//         return true;
//       }
//       else{
//         throw Exception("Server Error : ${response.statusCode}");
//       }
//     }catch(e){
//       print("Error Validating");
//       return false;
//     }
//   }
// }
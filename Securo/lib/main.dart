
import 'dart:developer' as console;
import 'package:codenebula/Services/linkvalidator.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

import 'package:glassmorphism/glassmorphism.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:iconsax/iconsax.dart';
import 'package:sliding_up_panel/sliding_up_panel.dart';

void main() async{
  WidgetsFlutterBinding.ensureInitialized();

  try {
    final data = await rootBundle.load('assets/phishing_model.tflite');
    print("✅ Model asset loaded, size = ${data.lengthInBytes}");
  } catch (e) {
    print("❌ Failed to load asset: $e");
  }

  LinkHandler.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const MainScreen(),
    );
  }
}

class LinkHandler {
  static const platform = MethodChannel("my_channel");
  static final _detector = LinkValidator();

  static void init() async{

    await _detector.init();

    platform.setMethodCallHandler((call) async {
      if (call.method == "onLinkReceived") {
        String url = call.arguments as String;

        console.log(url);
        // console.log("kaam se pehle h");
        // final res = LinkValidator.checklink(url);

        final isphishy = _detector.classify(url);
        platform.invokeMethod("showDialog", {"URL" : url});
        //
        // for (int i = 0; i <= 100; i += 20) {
        //   await Future.delayed(const Duration(milliseconds: 500));
        //   await updateProgress(i);
        // }


        // console.log("kaam hogya h");
        console.log(isphishy);

        // platform.invokeMethod("validated",{"val":isphishy});

        // console.log("invoked the methoddd");

        // platform.invokeMethod("invalidated",{"val":isphishy});
        // Process link here (send to backend, validate phishing, etc.)
      }
    });
  }
}

class PhishGuardApp extends StatelessWidget {
  const PhishGuardApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Securo',
      theme: ThemeData.dark().copyWith(
        primaryColor: const Color(0xFF10B981), // Emerald 400
        scaffoldBackgroundColor: const Color(0xFF1C1C1C), // Neutral 900
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF10B981),
          secondary: Color(0xFF34D399),
          surface: Color(0xFF262626),
          background: Color(0xFF1C1C1C),
        ),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen>
    with TickerProviderStateMixin {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late AnimationController _pulseController;
  late AnimationController _rotationController;
  bool _isScanning = false;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _rotationController = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _rotationController.dispose();
    super.dispose();
  }

  void _startScanning() {
    setState(() {
      _isScanning = true;
    });

    // Simulate scanning process
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() {
          _isScanning = false;
        });
        _showResultDialog();
      }
    });
  }

  void _showResultDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF262626),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Icon(Iconsax.shield_tick, color: Colors.green, size: 28),
            const SizedBox(width: 12),
            Text('Link Secure', style: GoogleFonts.inter(color: Colors.white)),
          ],
        ),
        content: Text(
          'The link appears to be safe. No phishing indicators detected.',
          style: GoogleFonts.inter(color: Colors.grey[300]),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK', style: TextStyle(color: const Color(0xFF10B981))),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: const Color(0xFF1C1C1C),
      drawer: _buildSidebar(),
      body: SlidingUpPanel(
        minHeight: 60,
        maxHeight: MediaQuery.of(context).size.height * 0.6,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        backdropEnabled: true,
        panel: _buildBottomPanel(),
        collapsed: _buildCollapsedPanel(),
        body: _buildMainBody(),
      ),
    );
  }

  Widget _buildSidebar() {
    return Container(
      width: 280,
      child: GlassmorphicContainer(
        width: 280,
        height: double.infinity,
        borderRadius: 0,
        blur: 20,
        alignment: Alignment.bottomCenter,
        border: 0,
        linearGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF1C1C1C).withOpacity(0.9),
            const Color(0xFF262626).withOpacity(0.9),
          ],
        ),
        borderGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF10B981).withOpacity(0.3),
            Colors.transparent,
          ],
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 40),
              // Profile Section
              AnimationConfiguration.staggeredList(
                position: 0,
                child: SlideAnimation(
                  verticalOffset: -50,
                  child: FadeInAnimation(
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  const Color(0xFF10B981),
                                  const Color(0xFF34D399),
                                ],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF10B981).withOpacity(0.3),
                                  blurRadius: 20,
                                  spreadRadius: 5,
                                ),
                              ],
                            ),
                            child: const Icon(
                              Iconsax.shield_security,
                              size: 40,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Securo Pro',
                            style: GoogleFonts.inter(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          Text(
                            'Advanced Protection',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: const Color(0xFF10B981),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              const Divider(color: Color(0xFF404040), thickness: 1),

              // Menu Items
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  children: [
                    _buildMenuItem(0, Iconsax.home, 'Dashboard', true),
                    _buildMenuItem(1, Iconsax.scan, 'Link Scanner'),
                    _buildMenuItem(2, Iconsax.shield_tick, 'Protection Status'),
                    _buildMenuItem(3, Iconsax.chart, 'Analytics'),
                    _buildMenuItem(4, Iconsax.setting, 'Settings'),
                    _buildMenuItem(5, Iconsax.info_circle, 'About'),
                  ],
                ),
              ),

              // Bottom Stats
              Container(
                margin: const EdgeInsets.all(20),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF10B981).withOpacity(0.1),
                      const Color(0xFF34D399).withOpacity(0.1),
                    ],
                  ),
                  border: Border.all(
                    color: const Color(0xFF10B981).withOpacity(0.3),
                  ),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Links Scanned',
                          style: GoogleFonts.inter(
                            color: Colors.grey[400],
                            fontSize: 12,
                          ),
                        ),
                        Text(
                          '1,247',
                          style: GoogleFonts.inter(
                            color: const Color(0xFF10B981),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Threats Blocked',
                          style: GoogleFonts.inter(
                            color: Colors.grey[400],
                            fontSize: 12,
                          ),
                        ),
                        Text(
                          '89',
                          style: GoogleFonts.inter(
                            color: Colors.red[400],
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(int index, IconData icon, String title, [bool isActive = false]) {
    return AnimationConfiguration.staggeredList(
      position: index,
      child: SlideAnimation(
        horizontalOffset: -50,
        child: FadeInAnimation(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: ListTile(
              leading: Icon(
                icon,
                color: isActive ? const Color(0xFF10B981) : Colors.grey[400],
                size: 24,
              ),
              title: Text(
                title,
                style: GoogleFonts.inter(
                  color: isActive ? const Color(0xFF10B981) : Colors.grey[400],
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
                ),
              ),
              selected: isActive,
              selectedTileColor: const Color(0xFF10B981).withOpacity(0.1),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              onTap: () {
                setState(() {
                  _selectedIndex = index;
                });
                Navigator.pop(context);
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMainBody() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            const Color(0xFF1C1C1C),
            const Color(0xFF262626).withOpacity(0.8),
            const Color(0xFF1C1C1C),
          ],
        ),
      ),
      child: SafeArea(
        child: Column(
          children: [
            // Custom App Bar
            _buildCustomAppBar(),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    // Main Shield Animation
                    _buildMainShield(),

                    const SizedBox(height: 40),

                    // Status Cards
                    _buildStatusCards(),

                    const SizedBox(height: 30),

                    // Scan Button
                    _buildScanButton(),

                    const SizedBox(height: 30),

                    // Recent Activity
                    _buildRecentActivity(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomAppBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Row(
        children: [
          IconButton(
            onPressed: () => _scaffoldKey.currentState?.openDrawer(),
            icon: const Icon(Iconsax.menu, color: Colors.white, size: 28),
            style: IconButton.styleFrom(
              backgroundColor: const Color(0xFF262626).withOpacity(0.8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: AnimatedTextKit(
              animatedTexts: [
                TypewriterAnimatedText(
                  'Securo',
                  textStyle: GoogleFonts.inter(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  speed: const Duration(milliseconds: 200),
                ),
              ],
              isRepeatingAnimation: false,
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Iconsax.notification, color: Colors.white, size: 24),
            style: IconButton.styleFrom(
              backgroundColor: const Color(0xFF262626).withOpacity(0.8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMainShield() {
    return AnimationConfiguration.synchronized(
      child: SlideAnimation(
        verticalOffset: -100,
        child: FadeInAnimation(
          child: Container(
            width: 200,
            height: 200,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Outer glow ring
                AnimatedBuilder(
                  animation: _pulseController,
                  builder: (context, child) {
                    return Container(
                      width: 200 + (20 * _pulseController.value),
                      height: 200 + (20 * _pulseController.value),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: const Color(0xFF10B981).withOpacity(0.3 - (0.2 * _pulseController.value)),
                          width: 2,
                        ),
                      ),
                    );
                  },
                ),

                // Main shield container
                GlassmorphicContainer(
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  blur: 20,
                  alignment: Alignment.center,
                  border: 2,
                  linearGradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(0xFF10B981).withOpacity(0.2),
                      const Color(0xFF34D399).withOpacity(0.1),
                    ],
                  ),
                  borderGradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(0xFF10B981).withOpacity(0.6),
                      const Color(0xFF34D399).withOpacity(0.3),
                    ],
                  ),
                  child: AnimatedBuilder(
                    animation: _rotationController,
                    builder: (context, child) {
                      return Transform.rotate(
                        angle: _rotationController.value * 2 * 3.14159,
                        child: const Icon(
                          Iconsax.shield_security,
                          size: 80,
                          color: Color(0xFF10B981),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStatusCards() {
    return Row(
      children: [
        Expanded(child: _buildStatusCard('Active', 'Protection On', Iconsax.shield_tick, Colors.green)),
        const SizedBox(width: 16),
        Expanded(child: _buildStatusCard('24/7', 'Monitoring', Iconsax.eye, const Color(0xFF10B981))),
      ],
    );
  }

  Widget _buildStatusCard(String title, String subtitle, IconData icon, Color color) {
    return AnimationConfiguration.synchronized(
      child: SlideAnimation(
        horizontalOffset: 50,
        child: FadeInAnimation(
          child: GlassmorphicContainer(
            width: double.infinity,
            height: 100,
            borderRadius: 20,
            blur: 20,
            alignment: Alignment.center,
            border: 1,
            linearGradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withOpacity(0.1),
                Colors.transparent,
              ],
            ),
            borderGradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withOpacity(0.3),
                Colors.transparent,
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: color, size: 28),
                const SizedBox(height: 8),
                Text(
                  title,
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    color: Colors.grey[400],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildScanButton() {
    return AnimationConfiguration.synchronized(
      child: SlideAnimation(
        verticalOffset: 100,
        child: FadeInAnimation(
          child: GestureDetector(
            onTap: _isScanning ? null : _startScanning,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: double.infinity,
              height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
                gradient: LinearGradient(
                  colors: _isScanning
                      ? [Colors.grey[600]!, Colors.grey[700]!]
                      : [const Color(0xFF10B981), const Color(0xFF34D399)],
                ),
                boxShadow: [
                  BoxShadow(
                    color: (_isScanning ? Colors.grey : const Color(0xFF10B981)).withOpacity(0.4),
                    blurRadius: 20,
                    spreadRadius: 0,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_isScanning)
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        strokeWidth: 2,
                      ),
                    )
                  else
                    Icon(Iconsax.scan, color: Colors.white, size: 24),
                  const SizedBox(width: 12),
                  Text(
                    _isScanning ? 'Scanning...' : 'Scan Latest Link',
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRecentActivity() {
    return AnimationConfiguration.synchronized(
      child: SlideAnimation(
        verticalOffset: 100,
        child: FadeInAnimation(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Recent Activity',
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              ...List.generate(3, (index) => _buildActivityItem(index)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActivityItem(int index) {
    final activities = [
      {'icon': Iconsax.shield_tick, 'title': 'Link Verified', 'subtitle': 'google.com - Safe', 'color': Colors.green},
      {'icon': Iconsax.warning_2, 'title': 'Threat Blocked', 'subtitle': 'suspicious-site.com', 'color': Colors.red},
      {'icon': Iconsax.shield_tick, 'title': 'Link Verified', 'subtitle': 'github.com - Safe', 'color': Colors.green},
    ];

    final activity = activities[index];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GlassmorphicContainer(
        width: double.infinity,
        height: 70,
        borderRadius: 16,
        blur: 20,
        alignment: Alignment.centerLeft,
        border: 1,
        linearGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF262626).withOpacity(0.8),
            const Color(0xFF1C1C1C).withOpacity(0.8),
          ],
        ),
        borderGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            (activity['color'] as Color).withOpacity(0.3),
            Colors.transparent,
          ],
        ),
        child: ListTile(
          leading: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: (activity['color'] as Color).withOpacity(0.2),
            ),
            child: Icon(
              activity['icon'] as IconData,
              color: activity['color'] as Color,
              size: 20,
            ),
          ),
          title: Text(
            activity['title'] as String,
            style: GoogleFonts.inter(
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
          subtitle: Text(
            activity['subtitle'] as String,
            style: GoogleFonts.inter(
              color: Colors.grey[400],
              fontSize: 12,
            ),
          ),
          trailing: Text(
            '${index + 1}m ago',
            style: GoogleFonts.inter(
              color: Colors.grey[500],
              fontSize: 11,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBottomPanel() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            const Color(0xFF262626),
            const Color(0xFF1C1C1C),
          ],
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[600],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(24),
              children: [
                Text(
                  'Advanced Settings',
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),
                _buildSettingItem('Real-time Protection', true),
                _buildSettingItem('Block Suspicious Links', true),
                _buildSettingItem('Enable Notifications', false),
                _buildSettingItem('Auto-scan Clipboard', true),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingItem(String title, bool value) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: GoogleFonts.inter(
              color: Colors.white,
              fontSize: 16,
            ),
          ),
          Switch(
            value: value,
            onChanged: (val) {},
            activeColor: const Color(0xFF10B981),
            inactiveThumbColor: Colors.grey[400],
            inactiveTrackColor: Colors.grey[700],
          ),
        ],
      ),
    );
  }

  Widget _buildCollapsedPanel() {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF262626),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF10B981).withOpacity(0.1),
            blurRadius: 10,
            spreadRadius: 0,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Iconsax.arrow_up_2, color: Colors.grey[400], size: 20),
          const SizedBox(width: 8),
          Text(
            'Swipe up for settings',
            style: GoogleFonts.inter(
              color: Colors.grey[400],
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
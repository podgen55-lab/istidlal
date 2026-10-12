# وثيقة المواصفات المعمارية للترحيل نحو FlutterFlow وFlutter/Dart
## مشروع: "Istidlal by fnk" (إستدلال) - بكالوريا علوم الطبيعة والحياة

تم إعداد هذه الوثيقة استناداً إلى الدليل التقني المعماري:
**"Architectural Blueprint for EdTech Platforms: Scaling from Google AI Studio Prototypes to Native Mobile Deployment"**

---

### 1. جدول المطابقة البنيوية (Component & State Mapping Table)

| React Web Component / Hook | النظير في FlutterFlow | النظير في Flutter / Dart النظيف | ملاحظات الأداء ودورة الحياة |
| :--- | :--- | :--- | :--- |
| `useReducer(gamificationReducer)` | `FFAppState` (Global) | `ChangeNotifier` + `Provider` / `Riverpod` | مركزية إدارة نقاط XP والقلوب لمنع حالات التنافس (Race Conditions). |
| `useOptimistic` + `useTransition` | Action Output + Local State | `ValueNotifier` مع Optimistic Mutation | تحديث الواجهة فورياً والتراجع التلقائي (Rollback) في حال فشل الشبكة. |
| `DocumentStudio.jsx` | `Container` + `InteractiveViewer` | `InteractiveViewer` مع `Image.network` | تكبير حقيقي (Pinch to Zoom) دون استخدام أي SVG اصطناعي. |
| `SocraticTutor.jsx` | `ListView` + Component State | `CustomScrollView` + `SliverList` | الحفاظ على حالة التحقق (Checkpoint) ومنع زر المتابعة. |
| `Navigation.jsx` (5 Tabs) | `NavBar` (Custom FlutterFlow) | `NavigationBar` / `BottomNavigationBar` | أهداف لمس قياسية لا تقل عن `48x48 dp` (`h-12 w-12`). |
| `tailwind: flex-col` | `Column` Widget | `Column(children: [...])` | ترتيب العناصر رأسياً. |
| `tailwind: grid grid-cols-1 md:grid-cols-2` | `GridView` Widget | `GridView.builder` (Responsive delegate) | تكيف الشاشات بين الهاتف المحمول والأجهزة اللوحية. |

---

### 2. الوقاية الصارمة من تسريب الذاكرة (Memory Leak Prevention in Flutter)

وفقاً للصفحة 7 من الدليل المعماري، يُمنع فتح تدفقات `snapshots().listen(...)` دون إدارة دورة حياتها:

```dart
// نمط كود Dart الإجباري لإدارة تدفقات Firestore في بيئة Flutter:
class SocraticSessionController extends ChangeNotifier {
  StreamSubscription<DocumentSnapshot>? _userSubscription;

  void listenToUserGamification(String uid) {
    // إلغاء أي اشتراك سابق لتفادي تراكم المستمعين
    _userSubscription?.cancel();
    
    _userSubscription = FirebaseFirestore.instance
        .collection('users')
        .doc(uid)
        .snapshots()
        .listen((snapshot) {
          if (snapshot.exists) {
            // تحديث الحالة وإخطار الواجهة
            notifyListeners();
          }
        }, onError: (error) {
          debugPrint("Firestore Stream Error: $error");
        });
  }

  @override
  void dispose() {
    // إغلاق التدفق حتماً عند مغادرة الشاشة لمنع استنزاف البطارية واستهلاك القراءات
    _userSubscription?.cancel();
    super.dispose();
  }
}
```

---

### 3. تأمين نظام التحفيز (Anti-Cheat Security Rules in Cloud Firestore)

تطبيق القواعد الوزارية الصارمة لمنع تعديل النقاط من جانب العميل:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId
        // التحقق من الحقول المعدلة حصراً
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['currentXP', 'currentStreak', 'hearts', 'last_action_timestamp'])
        // التحقق الرياضي الصارم من زيادة الـ XP بمقدار محدد مسبقاً (+20 XP)
        && (request.resource.data.currentXP == resource.data.currentXP + 20 || request.resource.data.currentXP == resource.data.currentXP)
        // Rate Limiting عبر وقت الخادم لمنع السكربتات التكرارية
        && request.time >= resource.data.last_action_timestamp + duration.value(3, 's')
        && request.resource.data.last_action_timestamp == request.time;
    }
  }
}
```

---

### 4. استراتيجية المزامنة اللحظية (Immediate Hydration via Compound Queries)

لمنع الشاشات البيضاء أو تحميل البيانات على مراحل متقطعة (Waterfalls)، يتم استدعاء وثيقة المستخدم والمجموعات الفرعية بالتوازي:

```dart
Future<void> hydrateStudentDashboard(String uid) async {
  final userDocFuture = FirebaseFirestore.instance.collection('users').doc(uid).get();
  final historicalScoresFuture = FirebaseFirestore.instance
      .collection('users')
      .doc(uid)
      .collection('historical_scores')
      .orderBy('timestamp', descending: true)
      .limit(50)
      .get();

  // جلب متزامن في آن واحد
  final results = await Future.wait([userDocFuture, historicalScoresFuture]);
  
  // حقن البيانات في App State مرة واحدة قبل بناء الواجهة
  FFAppState().update(() {
    FFAppState().userProfile = results[0].data();
    FFAppState().recentScores = results[1].docs.map((d) => d.data()).toList();
  });
}
```

---

### 5. إدارة الكاش والعمل بدون إنترنت (Offline Caching Strategy)

- **في تطبيق الويب (React):** يتم تفعيل التخزين المؤقت برمجياً عبر `enablePersistence()`.
- **في تطبيق Flutter / FlutterFlow:** التخزين المؤقت مفعل افتراضياً بحجم `100 MB`. يتم ضبط خيار `PersistenceEnabled: true` للتعامل مع انقطاع اتصال التلاميذ ومزامنة الإجابات فور عودة التغطية.

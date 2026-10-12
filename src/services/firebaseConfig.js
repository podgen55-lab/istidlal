/**
 * ==============================================================================
 * firebaseConfig.js - جسر البيانات السحابي ونموذج الجلب اللحظي (Data Bridge)
 * مطابق لتعليمات: Architectural Blueprint for EdTech Platforms (Pages 8-10)
 * ==============================================================================
 * يحدد:
 * 1. بنية المجموعات السحابية: /users/{uid} و /users/{uid}/historical_scores/{score_id}
 * 2. دالة الجلب المركب المتزامن (Compound Batched Fetch) عبر Promise.all لتفادي شلالات التحميل (Waterfalls).
 * 3. التهيئة الجاهزة للربط مع FlutterFlow عبر نفس قاعدة Firestore المشتركة.
 */

// نموذج بيانات وثيقة المستخدم في Firestore (/users/{uid})
export const UserDocumentSchema = {
  uid: '', // Firebase Auth UID
  displayName: '',
  email: '',
  createdAt: null, // FieldValue.serverTimestamp()
  currentXP: 140,
  currentStreak: 3,
  hearts: 5,
  level: '3AS - علوم تجريبية / رياضيات',
  last_action_timestamp: null, // FieldValue.serverTimestamp() لمنع التكرار الآلي (Rate Limiting)
};

// نموذج بيانات السجل التاريخي للنقاط (/users/{uid}/historical_scores/{score_id})
export const HistoricalScoreSchema = {
  scoreId: '',
  nodeId: '', // معرف محطة التعلم (e.g., 'node_1_transcription_mechanism')
  exerciseType: 'EX_1', // 'EX_1' | 'EX_2' | 'EX_3'
  xpGained: 20,
  rawScore: 4.5, // من 5 أو 7 أو 8
  maxPoints: 5.0,
  rubricBreakdown: {}, // تفصيل المؤشرات المحققة
  timestamp: null, // مرتب تنازلياً (descending) لدعم الشاشات والرسوم البيانية فوراً
};

/**
 * دالة الجلب المتزامن المركب (Compound Batch Hydration)
 * تجلب وثيقة المستخدم والمجموعات الفرعية بالتوازي عبر Promise.all
 * وتمنع ظهور الشاشات الفارغة أو ومضات التحميل المتعاقبة (Waterfall Flash).
 *
 * @param {object} firestore - كائن Firestore SDK
 * @param {string} uid - معرّف المستخدم
 * @returns {Promise<{profile: object, historicalScores: Array}>}
 */
export async function hydrateUserStateCompound(firestore, uid) {
  if (!uid) throw new Error('UID is required for state hydration');

  try {
    // إطلاق الاستعلامين بالتوازي (Parallel Compound Query)
    const userDocPromise = firestore
      .collection('users')
      .doc(uid)
      .get();

    const historicalScoresPromise = firestore
      .collection('users')
      .doc(uid)
      .collection('historical_scores')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    // انتظار النتيجتين معاً (Promise.all)
    const [userDocSnap, scoresSnap] = await Promise.all([
      userDocPromise,
      historicalScoresPromise,
    ]);

    const profileData = userDocSnap.exists ? userDocSnap.data() : null;
    const historicalScores = scoresSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      profile: profileData,
      historicalScores,
    };
  } catch (error) {
    console.error('Error during compound hydration:', error);
    throw error;
  }
}

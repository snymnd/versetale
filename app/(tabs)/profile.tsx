import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OrnamentStar } from '@/components/brand';
import { Button, Card, Eyebrow, Text } from '@/components/ui';
import { fontFamily, palette, radii, spacing, useColors } from '@/lib/theme';
import { useAuthStore } from '@/features/auth/authStore';
import { useQuestProgressStore } from '@/features/journeys/journeyStore';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * Profile — "Your practice." Streak hero in Lantern Amber, a 2×2 stats
 * grid (numbers in Fraunces — story not score), then a settings list.
 */
export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const progress = useQuestProgressStore((s) => s.progress);
  const { colors, shadow } = useColors();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout, isLoggingOut]);

  // Derive practice stats from the persisted progress store.
  const stats = useMemo(() => {
    const journeyEntries = Object.values(progress);
    const journeyCount = journeyEntries.length;
    const completedQuests = journeyEntries.reduce((sum, j) => {
      return sum + Object.values(j.quests).filter((q) => q.status === 'completed').length;
    }, 0);
    // Reflections — count keys we've persisted to AsyncStorage. Skipped here
    // for now since the count requires an async lookup; default to 0.
    return {
      journeyCount,
      completedQuests,
    };
  }, [progress]);

  // Streak placeholder — no streak engine yet, so render a static-looking
  // 7-day strip with today highlighted as the next available day.
  const todayIndex = (new Date().getDay() + 6) % 7; // 0=Mon, 6=Sun

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.fg }]}>Your practice</Text>
            <Text variant="caption" tone="muted" style={styles.headerSub}>
              {user?.name ? user.name : 'VerseTale reader'}
              {user?.email ? ` · ${user.email}` : ''}
            </Text>
          </View>
        </SafeAreaView>

        {/* Streak hero */}
        <Card padding={spacing[5]} style={styles.streakCard}>
          <View pointerEvents="none" style={styles.streakOrnament}>
            <OrnamentStar size={140} color={palette.amber[500]} strokeWidth={1} />
          </View>
          <Eyebrow color={palette.amber[700]}>Reading streak</Eyebrow>
          <View style={styles.streakRow}>
            <Text style={[styles.streakNumber, { color: palette.amber[700] }]}>
              {stats.completedQuests}
            </Text>
            <Text variant="caption" tone="muted" style={styles.streakLabel}>
              days · longest yet
            </Text>
          </View>
          <View style={styles.dayStrip}>
            {DAY_LABELS.map((d, i) => {
              const done = i < todayIndex;
              const today = i === todayIndex;
              return (
                <View key={`${d}-${i}`} style={styles.dayCell}>
                  <View
                    style={[
                      styles.dayDot,
                      done
                        ? { backgroundColor: palette.amber[300] }
                        : today
                          ? {
                              backgroundColor: palette.amber[100],
                              borderColor: palette.amber[500],
                              borderWidth: 1.5,
                            }
                          : { backgroundColor: colors.bgSunken },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        {
                          color: done
                            ? palette.amber[700]
                            : today
                              ? palette.amber[500]
                              : colors.fgSubtle,
                        },
                      ]}
                    >
                      {d}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatTile label="Verses read" value={stats.completedQuests * 6} sub="this season" />
          <StatTile label="Reflections" value={0} sub="saved" />
          <StatTile label="Time read" value={`${(stats.completedQuests * 9 / 60).toFixed(1)}`} unit="hr" sub="estimated" />
          <StatTile
            label="Journeys"
            value={stats.journeyCount}
            sub={`of ${Math.max(stats.journeyCount, 1)} started`}
          />
        </View>

        {/* Settings */}
        <Eyebrow style={styles.sectionLabel}>Reading</Eyebrow>
        <Card padding={0} style={styles.settingsCard}>
          {[
            { label: 'Translation', value: 'Sahih International' },
            { label: 'Reciter', value: 'al-ʿAfāsy' },
            { label: 'Daily reminder', value: 'After Maghrib' },
            { label: 'Theme', value: 'Auto · Night reading' },
          ].map((row, i, arr) => (
            <View
              key={row.label}
              style={[
                styles.settingsRow,
                i < arr.length - 1
                  ? { borderBottomColor: colors.divider, borderBottomWidth: 1 }
                  : null,
              ]}
            >
              <Text variant="body" style={styles.settingsLabel}>
                {row.label}
              </Text>
              <Text variant="caption" tone="muted">
                {row.value}
              </Text>
            </View>
          ))}
        </Card>

        <Eyebrow style={styles.sectionLabel}>Account</Eyebrow>
        <Card padding={spacing[4]} style={[styles.signoutCard, { borderColor: colors.border, ...shadow.sm }]}>
          <Button
            variant="ghost"
            fullWidth
            onPress={handleLogout}
            loading={isLoggingOut}
            style={styles.signoutBtn}
          >
            Sign out
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
}

interface StatTileProps {
  label: string;
  value: number | string;
  unit?: string;
  sub: string;
}

function StatTile({ label, value, unit, sub }: StatTileProps) {
  const { colors } = useColors();
  return (
    <Card padding={spacing[4]} style={styles.statTile}>
      <Eyebrow style={styles.statLabel}>{label}</Eyebrow>
      <View style={styles.statValueRow}>
        <Text style={[styles.statValue, { color: colors.fg }]}>{value}</Text>
        {unit ? <Text variant="caption" tone="muted" style={styles.statUnit}>{unit}</Text> : null}
      </View>
      <Text variant="meta" tone="muted">
        {sub}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    paddingBottom: 140,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: spacing[2],
    paddingBottom: spacing[5],
    gap: 4,
  },
  headerTitle: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  headerSub: {
    marginTop: 2,
  },

  // Streak card
  streakCard: {
    marginBottom: spacing[4],
    overflow: 'hidden',
  },
  streakOrnament: {
    position: 'absolute',
    right: -20,
    top: -20,
    opacity: 0.07,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginVertical: spacing[3],
  },
  streakNumber: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 56,
    lineHeight: 56,
    letterSpacing: -1.68,
  },
  streakLabel: {
    fontSize: 14,
  },
  dayStrip: {
    flexDirection: 'row',
    gap: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
  },
  dayDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 11,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing[5],
  },
  statTile: {
    width: '48.5%',
  },
  statLabel: {
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontFamily: fontFamily.displayMedium,
    fontSize: 26,
    letterSpacing: -0.52,
    lineHeight: 32,
  },
  statUnit: {
    fontSize: 14,
  },

  // Settings
  sectionLabel: {
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  settingsCard: {
    marginBottom: spacing[5],
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  settingsLabel: {
    fontSize: 14,
  },

  // Sign out
  signoutCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  signoutBtn: {
    alignSelf: 'stretch',
  },
});

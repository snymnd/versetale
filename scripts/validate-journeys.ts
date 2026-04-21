#!/usr/bin/env tsx
/**
 * Validates journey JSON files against their Zod schemas.
 * Run: npx tsx scripts/validate-journeys.ts
 */

import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs';

// ---------- Shared schemas ----------

const VerseKeySchema = z
  .string()
  .regex(/^\d{1,3}:\d{1,3}$/, 'Verse key must be in {surah}:{ayah} format, e.g. "12:4"');

const CoverGradientSchema = z
  .tuple([z.string().regex(/^#[0-9a-fA-F]{6}$/), z.string().regex(/^#[0-9a-fA-F]{6}$/)])
  .describe('Two-stop hex gradient [start, end]');

const DifficultySchema = z.enum(['beginner', 'intermediate', 'advanced']);

// ---------- Journey index schema ----------

const JourneySummarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  titleArabic: z.string().min(1),
  description: z.string().min(10),
  coverGradient: CoverGradientSchema,
  totalQuests: z.number().int().min(1).max(30),
  difficulty: DifficultySchema,
  tags: z.array(z.string()).min(1),
});

const JourneyIndexSchema = z.object({
  journeys: z.array(JourneySummarySchema).min(1),
});

// ---------- Individual journey schema ----------

const QuestSchema = z.object({
  id: z.string().min(1),
  day: z.number().int().min(1),
  title: z.string().min(1),
  titleArabic: z.string().min(1),
  narrative: z.string().min(20),
  verseKeys: z.array(VerseKeySchema).min(1),
  reflection: z.string().min(20),
  completionPrompt: z.string().min(10),
});

const JourneyDetailSchema = JourneySummarySchema.extend({
  quests: z.array(QuestSchema).min(1),
}).refine(
  (data) => data.quests.length === data.totalQuests,
  {
    message: 'totalQuests does not match actual quest count',
  },
);

// ---------- Validation runner ----------

function validateFile(filePath: string, schema: z.ZodTypeAny, label: string): boolean {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const json: unknown = JSON.parse(raw);
    const result = schema.safeParse(json);

    if (result.success) {
      console.log(`  [PASS] ${label}`);
      return true;
    }

    console.error(`  [FAIL] ${label}`);
    result.error.issues.forEach((issue) => {
      console.error(`         Path: ${issue.path.join('.')} — ${issue.message}`);
    });
    return false;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  [ERROR] ${label}: ${message}`);
    return false;
  }
}

function main() {
  const contentDir = path.resolve(__dirname, '../content/journeys');
  let allPassed = true;

  console.log('\nValidating journey content...\n');

  // 1. Validate index
  const indexPath = path.join(contentDir, 'index.json');
  if (!validateFile(indexPath, JourneyIndexSchema, 'content/journeys/index.json')) {
    allPassed = false;
  }

  // 2. Validate each individual journey file
  const indexRaw = fs.readFileSync(indexPath, 'utf-8');
  const index = JSON.parse(indexRaw) as { journeys: Array<{ id: string }> };

  index.journeys.forEach(({ id }) => {
    const filePath = path.join(contentDir, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`  [MISSING] content/journeys/${id}.json`);
      allPassed = false;
      return;
    }
    if (!validateFile(filePath, JourneyDetailSchema, `content/journeys/${id}.json`)) {
      allPassed = false;
    }
  });

  console.log('');

  if (allPassed) {
    console.log('All journey files are valid.\n');
    process.exit(0);
  } else {
    console.error('Validation failed. Fix the errors above.\n');
    process.exit(1);
  }
}

main();

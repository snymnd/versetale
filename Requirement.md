# 📄 Product Requirement Document (PRD)
**Project Name:** VerseTale
**Platform:** Mobile Application (iOS & Android)
**Objective:** A narrative-driven Quran companion that transforms divine stories into bite-sized daily reading quests to build lasting post-Ramadan habits.

### 1. Problem Statement & Vision
**The Problem:** Post-Ramadan drop-off. Millions struggle to maintain a daily relationship with the Quran because reading full chapters without structured context feels overwhelming and lacks immediate personal relevance.
**The Solution (VerseTale):** Shift the UX from "reading chapters" to "experiencing stories." By breaking the *Qisas* (stories) of the Quran into short, thematic, multi-day arcs (Journeys) accompanied by reflection prompts, the app builds intrinsic motivation and sustainable daily habits.

### 2. Target User Personas
* **The Busy Professional/Commuter:** Has 10 minutes a day. Needs bite-sized, audio-supported content.
* **The Seeker:** Wants to understand the meaning (Tafsir) and apply it to their modern life, not just recite in Arabic.

### 3. Core Epics & User Stories
#### Epic 1: Authentication (Quran.com OIDC)
* **Feature:** Secure login via Quran Foundation.
* **User Story:** As a user, I want to log in using my Quran.com account so my reading streaks and reflections are synced to my global profile.

#### Epic 2: The Journey Library (Discovery)
* **Feature:** A Netflix-style carousel of available narrative arcs.
* **User Story:** As a user, I want to browse beautiful story cards (e.g., "The Resilience of Yusuf," "The Cave Sleepers") and see how many days each journey takes to complete.

#### Epic 3: The Daily Quest (The Core Reader)
* **Feature:** A highly focused reading view presenting only today's assigned verses, translation, audio, and simplified Tafsir.
* **User Story:** As a user, I want to read my 5-10 verses for the day, listen to the audio recitation, and read a brief context summary so I can easily digest the story without getting lost.

#### Epic 4: Reflection & Habit Tracking
* **Feature:** Socratic reflection prompts and streak tracking.
* **User Story:** As a user, after reading today's portion, I want to answer a short reflection question, save my thoughts, and see my daily streak increase to stay motivated.

### 4. UI/UX Layout Specifications
* **Navigation:** Bottom Tab Bar (1. Home/Library, 2. Active Quest, 3. Profile/Reflections).
* **Design System:** Minimalist, clean typography, ample whitespace. 
* **Color Palette:** Cool blue-to-teal gradients (matching the logo), dark mode support for nighttime reading.

---

# 🛠️ Technical Requirement Document (TRD)

### 1. System Architecture & Tech Stack
* **Framework:** React Native (Expo Managed Workflow).
* **Routing:** Expo Router (File-based routing).
* **State Management:** Zustand (for lightweight global state holding Auth tokens and active Quest progress).
* **Data Fetching:** TanStack React Query (for caching API responses and managing loading/error states).
* **UI Styling:** Tailwind CSS via NativeWind OR standard React Native StyleSheet (choose one and stick to it strictly).

### 2. Authentication Configuration (OAuth 2.0)
**Agent Instruction:** Use `expo-auth-session` to handle the OIDC flow.
* **Authorization Endpoint:** `https://auth.quran.foundation/oauth/authorize`
* **Token Endpoint:** `https://auth.quran.foundation/oauth/token`
* **Client Scheme:** `versetale`
* **Redirect URI:** `versetale://auth/callback`
* **Post-logout Redirect URI:** `versetale://auth/logout`
* **Scopes Required:** `openid`, `profile`, `offline_access`
* **Storage:** Access tokens MUST be securely stored using `expo-secure-store`.

### 3. API Integration
You can check detail availabel API that we can use here

# Quran Foundation API
> API documentation for Quran.com content, search, user, and authentication APIs.

## OpenAPI Specifications
- [Content APIs v4](https://api-docs.quran.foundation/openAPI/content/v4.json): Verses, chapters, translations, tafsirs, audio
- [User APIs v1 (Production)](https://api-docs.quran.foundation/openAPI/user-related-apis/v1.json): Stable production documentation for bookmarks, collections, notes, profiles, rooms, posts
- [User APIs v1 (Pre-live)](https://api-docs.quran.foundation/openAPI/user-related-apis/pre-live/v1.json): Upcoming pre-live documentation for unreleased user API changes
- [OAuth2 APIs v1](https://api-docs.quran.foundation/openAPI/oauth2-apis/v1.json): Authentication and authorization
- [Search APIs v1](https://api-docs.quran.foundation/openAPI/search/v1.json): Quran text search

## Getting Started

- [Field Reference](https://api-docs.quran.foundation/docs/api/field-reference)
- [First Content API Call](https://api-docs.quran.foundation/docs/quickstart/first-api-call)
- [Quran Foundation Content APIs OAuth2 Quickstart](https://api-docs.quran.foundation/docs/quickstart)
- [Manual Authentication for Content APIs](https://api-docs.quran.foundation/docs/quickstart/manual-authentication)
- [Migrate from api.quran.com to Quran Foundation Content APIs](https://api-docs.quran.foundation/docs/quickstart/migration)
- [Token Management for Content APIs](https://api-docs.quran.foundation/docs/quickstart/token-management)
- [📢 API Updates](https://api-docs.quran.foundation/docs/updates)

## Content APIs v4

- [Lookup verse by timestamp](https://api-docs.quran.foundation/docs/content_apis_versioned/audio-reciter-lookup)
- [Get timestamp range](https://api-docs.quran.foundation/docs/content_apis_versioned/audio-reciter-timestamp)
- [Chapter Infos](https://api-docs.quran.foundation/docs/content_apis_versioned/chapter-info)
- [Get chapter's audio file of a reciter](https://api-docs.quran.foundation/docs/content_apis_versioned/chapter-reciter-audio-file)
- [List of all chapter audio files of a reciter](https://api-docs.quran.foundation/docs/content_apis_versioned/chapter-reciter-audio-files)
- [List of Chapter Reciters](https://api-docs.quran.foundation/docs/content_apis_versioned/chapter-reciters)
- [Content APIs](https://api-docs.quran.foundation/docs/content_apis_versioned/content-apis)
- [Get Chapter Info](https://api-docs.quran.foundation/docs/content_apis_versioned/get-chapter-info)
- [Get Chapter](https://api-docs.quran.foundation/docs/content_apis_versioned/get-chapter)
- [Get Footnote](https://api-docs.quran.foundation/docs/content_apis_versioned/get-foot-note)
- [Get Hizb](https://api-docs.quran.foundation/docs/content_apis_versioned/get-hizb)
- [Get Juz](https://api-docs.quran.foundation/docs/content_apis_versioned/get-juz)
- [Get Manzil](https://api-docs.quran.foundation/docs/content_apis_versioned/get-manzil)
- [Get Rubʿ al-Ḥizb](https://api-docs.quran.foundation/docs/content_apis_versioned/get-rub-el-hizb)
- [Get Ruku](https://api-docs.quran.foundation/docs/content_apis_versioned/get-ruku)
- [Languages](https://api-docs.quran.foundation/docs/content_apis_versioned/languages)
- [Get Ayah recitations for specific Ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/list-ayah-recitation)
- [Get tafsirs for specific Ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/list-ayah-tafsirs)
- [Get translations for specific Ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/list-ayah-translations)
- [List Chapters](https://api-docs.quran.foundation/docs/content_apis_versioned/list-chapters)
- [Get Ayah recitations for specific Hizb](https://api-docs.quran.foundation/docs/content_apis_versioned/list-hizb-recitation)
- [Get tafsirs for specific Hizb](https://api-docs.quran.foundation/docs/content_apis_versioned/list-hizb-tafsirs)
- [Get translations for specific Hizb](https://api-docs.quran.foundation/docs/content_apis_versioned/list-hizb-translations)
- [List Hizbs](https://api-docs.quran.foundation/docs/content_apis_versioned/list-hizbs)
- [Get Ayah recitations for specific Juz](https://api-docs.quran.foundation/docs/content_apis_versioned/list-juz-recitation)
- [Get tafsirs for specific Juz](https://api-docs.quran.foundation/docs/content_apis_versioned/list-juz-tafsirs)
- [Get translations for specific Juz](https://api-docs.quran.foundation/docs/content_apis_versioned/list-juz-translations)
- [List Juzs](https://api-docs.quran.foundation/docs/content_apis_versioned/list-juzs)
- [Get Ayah recitations for specific Manzil](https://api-docs.quran.foundation/docs/content_apis_versioned/list-manzil-recitation)
- [Get tafsirs for specific Manzil](https://api-docs.quran.foundation/docs/content_apis_versioned/list-manzil-tafsirs)
- [Get translations for specific Manzil](https://api-docs.quran.foundation/docs/content_apis_versioned/list-manzil-translations)
- [List Manzils](https://api-docs.quran.foundation/docs/content_apis_versioned/list-manzils)
- [Get Ayah recitations for specific Madani Mushaf page](https://api-docs.quran.foundation/docs/content_apis_versioned/list-page-recitation)
- [Get tafsirs for specific Madani Mushaf page](https://api-docs.quran.foundation/docs/content_apis_versioned/list-page-tafsirs)
- [Get translations for specific Madani Mushaf page](https://api-docs.quran.foundation/docs/content_apis_versioned/list-page-translations)
- [Get Ayah recitations for specific Rub el Hizb (alias: /by_rub_el_hizb)](https://api-docs.quran.foundation/docs/content_apis_versioned/list-rub-el-hizb-recitation-rub-el-hizb)
- [Get Ayah recitations for specific Rub el Hizb](https://api-docs.quran.foundation/docs/content_apis_versioned/list-rub-el-hizb-recitation)
- [Get tafsirs for specific Rub el Hizb](https://api-docs.quran.foundation/docs/content_apis_versioned/list-rub-el-hizb-tafsirs-rub)
- [Get tafsirs for specific Rub el Hizb (alias: /by_rub)](https://api-docs.quran.foundation/docs/content_apis_versioned/list-rub-el-hizb-tafsirs)
- [Get translations for specific Rub el Hizb](https://api-docs.quran.foundation/docs/content_apis_versioned/list-rub-el-hizb-translations-rub)
- [Get translations for specific Rub el Hizb (alias: /by_rub)](https://api-docs.quran.foundation/docs/content_apis_versioned/list-rub-el-hizb-translations)
- [List Rubʿ al-Ḥizb](https://api-docs.quran.foundation/docs/content_apis_versioned/list-rub-el-hizbs)
- [Get Ayah recitations for specific Ruku](https://api-docs.quran.foundation/docs/content_apis_versioned/list-ruku-recitation)
- [Get tafsirs for specific Ruku](https://api-docs.quran.foundation/docs/content_apis_versioned/list-ruku-tafsirs)
- [Get translations for specific Ruku](https://api-docs.quran.foundation/docs/content_apis_versioned/list-ruku-translations)
- [List Rukus](https://api-docs.quran.foundation/docs/content_apis_versioned/list-rukus)
- [Get Ayah recitations for specific Surah](https://api-docs.quran.foundation/docs/content_apis_versioned/list-surah-recitation)
- [Get tafsirs for specific Surah](https://api-docs.quran.foundation/docs/content_apis_versioned/list-surah-tafsirs)
- [Get translations for specific Surah](https://api-docs.quran.foundation/docs/content_apis_versioned/list-surah-translations)
- [Quran Reflect Lessons and Reflections Feed](https://api-docs.quran.foundation/docs/content_apis_versioned/posts-controller-feed)
- [Get Quran Reflect Lesson or Reflection by ID](https://api-docs.quran.foundation/docs/content_apis_versioned/posts-controller-find-one)
- [Get All Comments for a Quran Reflect Lesson or Reflection](https://api-docs.quran.foundation/docs/content_apis_versioned/posts-controller-get-all-comment)
- [Get Comments for a Quran Reflect Lesson or Reflection](https://api-docs.quran.foundation/docs/content_apis_versioned/posts-controller-get-comments)
- [Get Quran Reflect Lessons and Reflections by User](https://api-docs.quran.foundation/docs/content_apis_versioned/posts-controller-get-user-post)
- [Get Quran verses in a specific script](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-by-script)
- [Get V1 Glyph codes of ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-code-v-1)
- [Get V2 Glyph codes of ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-code-v-2)
- [Get Imlaei Simple text of ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-imlaei)
- [Get Indopak Nastaleeq Script of ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-indopak-nastaleeq)
- [Get Indopak Script of ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-indopak)
- [Get Uthmani simple script of ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-uthmani-simple)
- [Get Uthmani Tajweed Script of ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-uthmani-tajweed)
- [Get Uthmani Script of ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/quran-verses-uthmani)
- [Get random ayah](https://api-docs.quran.foundation/docs/content_apis_versioned/random-verse)
- [Get list of Audio files of single recitation](https://api-docs.quran.foundation/docs/content_apis_versioned/recitation-audio-files)
- [Recitation Info](https://api-docs.quran.foundation/docs/content_apis_versioned/recitation-info)
- [Recitation Styles](https://api-docs.quran.foundation/docs/content_apis_versioned/recitation-styles)
- [Recitations](https://api-docs.quran.foundation/docs/content_apis_versioned/recitations)
- [Tafsir Info](https://api-docs.quran.foundation/docs/content_apis_versioned/tafsir-info)
- [Get a single tafsir](https://api-docs.quran.foundation/docs/content_apis_versioned/tafsir)
- [Tafsirs](https://api-docs.quran.foundation/docs/content_apis_versioned/tafsirs)
- [Translation Info](https://api-docs.quran.foundation/docs/content_apis_versioned/translation-info)
- [Get a single translation](https://api-docs.quran.foundation/docs/content_apis_versioned/translation)
- [Translations](https://api-docs.quran.foundation/docs/content_apis_versioned/translations)
- [Verse Media](https://api-docs.quran.foundation/docs/content_apis_versioned/verse-media)
- [By Chapter](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-chapter-number)
- [By Hizb number](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-hizb-number)
- [By Juz](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-juz-number)
- [By Manzil](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-manzil-number)
- [By Page](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-page-number)
- [By Range](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-range)
- [By Rub el Hizb number](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-rub-el-hizb-number-rub-el-hizb)
- [By Rub el Hizb number (alias: /by_rub_el_hizb)](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-rub-el-hizb-number)
- [By Ruku](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-ruku-number)
- [By Specific Verse By Key](https://api-docs.quran.foundation/docs/content_apis_versioned/verses-by-verse-key)

## User-Related APIs v1

- [Reading Sessions vs Activity Days](https://api-docs.quran.foundation/docs/user-related-apis/reading-sessions-vs-activity-days)
- [Delete Bookmark](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-delete-v-1-bookmarks-by-bookmark-id)
- [Delete collection bookmark by id](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-delete-v-1-collections-by-collection-id-bookmarks-by-bookmark-id)
- [Delete collection bookmark by details](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-delete-v-1-collections-by-collection-id-bookmarks)
- [Delete collection](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-delete-v-1-collections-by-collection-id)
- [Delete a goal](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-delete-v-1-goals-by-id)
- [Delete note by ID](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-delete-v-1-notes-by-note-id)
- [Estimate reading time](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-activity-days-estimate-reading-time)
- [Get activity days](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-activity-days)
- [Get bookmarks within a range of Ayahs](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-bookmarks-ayahs-range)
- [Get bookmark](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-bookmarks-bookmark)
- [Get bookmark collections](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-bookmarks-collections)
- [Get user bookmarks](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-bookmarks)
- [Get all collection items](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-collections-all)
- [Get collection items by id](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-collections-by-collection-id)
- [Get all collections](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-collections)
- [Generate timeline estimation](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-goals-estimate)
- [Get today's goal plan](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-goals-get-todays-plan)
- [Get notes by attached entity](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-notes-by-attached-entity)
- [Get note by ID](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-notes-by-note-id)
- [Get notes by verse range](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-notes-by-range)
- [Get notes by verse](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-notes-by-verse-by-verse-key)
- [Get notes count within verse range](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-notes-count-within-range)
- [Get all notes](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-notes)
- [Get user preferences](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-preferences)
- [Get user reading sessions](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-reading-sessions)
- [Get current streak days](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-streaks-current-streak-days)
- [Get streaks](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-get-v-1-streaks)
- [Update note by ID](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-patch-v-1-notes-by-note-id)
- [Add/update activity day](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-activity-days)
- [Add user bookmark](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-bookmarks)
- [Add collection Bookmark](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-collections-by-collection-id-bookmarks)
- [Update collection](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-collections-by-collection-id)
- [Add collection](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-collections)
- [Create a goal](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-goals)
- [Publish note](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-notes-by-note-id-publish)
- [Add note](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-notes)
- [Bulk add or update preferences](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-preferences-bulk)
- [Add or update preference](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-preferences)
- [Add or update user reading session](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-post-v-1-reading-sessions)
- [Update a goal](https://api-docs.quran.foundation/docs/user_related_apis_versioned/auth-put-v-1-goals-by-id)
- [Create a new comment](https://api-docs.quran.foundation/docs/user_related_apis_versioned/comments-controller-create)
- [Delete a comment](https://api-docs.quran.foundation/docs/user_related_apis_versioned/comments-controller-delete-comment)
- [Get replies to a comment](https://api-docs.quran.foundation/docs/user_related_apis_versioned/comments-controller-get)
- [Toggle like/unlike a comment](https://api-docs.quran.foundation/docs/user_related_apis_versioned/comments-controller-toggle-like)
- [Create post](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-create)
- [Delete post](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-delete)
- [Edit post](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-edit)
- [Export posts as PDF](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-export-multiple-posts)
- [Get posts feed](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-feed)
- [Get post by ID](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-find-one)
- [Get all post comments](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-get-all-comment)
- [Get post comments](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-get-comments)
- [Get post liked state](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-get-liked-state)
- [Get current user posts](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-get-loggedin-user-posts)
- [Get posts by verse](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-get-my-posts-by-verse)
- [Get posts count within range](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-get-my-posts-count-within-range)
- [Get related posts](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-get-related-posts)
- [Get user posts](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-get-user-post)
- [Report post abuse](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-report-abuse)
- [Toggle post like](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-toggle-like)
- [Toggle post save](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-toggle-save)
- [Track post view](https://api-docs.quran.foundation/docs/user_related_apis_versioned/posts-controller-view-tracking)
- [Accept room invite by private token](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-accept-by-private-token)
- [Accept room invite](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-accept-invite)
- [Update room admin access](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-admins-access)
- [Create a new group](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-create-new-group)
- [Create a new page](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-create-new-page)
- [Follow a page](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-follow-page)
- [Get room members](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-get-room-members)
- [Get room posts](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-get-room-posts)
- [Get room profile by ID](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-get-room-profile-by-id)
- [Get room profile by URL or subdomain](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-get-room-profile)
- [Get joined or managed rooms](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-get-rooms)
- [Invite user to room](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-invite-user-to-room)
- [Join a group](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-join-room)
- [Leave a group](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-leave-group)
- [Reject room invite](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-reject-invite)
- [Remove member from room](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-remove-member)
- [Search rooms](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-search-rooms)
- [Unfollow a page](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-unfollow-page)
- [Update a group](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-update-group)
- [Update a page](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-update-page)
- [Update post privacy in room](https://api-docs.quran.foundation/docs/user_related_apis_versioned/rooms-controller-update-post-privacy)
- [OAuth2 Scopes](https://api-docs.quran.foundation/docs/user_related_apis_versioned/scopes)
- [Search and retrieve tags](https://api-docs.quran.foundation/docs/user_related_apis_versioned/tags-controller-find)
- [User-related APIs](https://api-docs.quran.foundation/docs/user_related_apis_versioned/user-related-apis)
- [Edit user profile](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-edit-profile)
- [Get user followers](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-get-user-followers)
- [Get users followed by user](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-get-user-following)
- [Get user profile by id or username](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-get-user-profile)
- [Get user profile](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-profile)
- [Remove a follower](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-remove-follower)
- [Get logged-in user rooms](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-rooms)
- [Search for users](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-search)
- [Toggle follow/unfollow a user](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-toggle-follow)
- [Update user profile](https://api-docs.quran.foundation/docs/user_related_apis_versioned/users-controller-update-profile)

## User-Related APIs v1 (Pre-live)

- [Delete Bookmark](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-delete-v-1-bookmarks-by-bookmark-id)
- [Delete collection bookmark by id](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-delete-v-1-collections-by-collection-id-bookmarks-by-bookmark-id)
- [Delete collection bookmark by details](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-delete-v-1-collections-by-collection-id-bookmarks)
- [Delete collection](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-delete-v-1-collections-by-collection-id)
- [Delete a goal](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-delete-v-1-goals-by-id)
- [Delete note by ID](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-delete-v-1-notes-by-note-id)
- [Estimate reading time](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-activity-days-estimate-reading-time)
- [Get activity days](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-activity-days)
- [Get bookmarks within a range of Ayahs](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-bookmarks-ayahs-range)
- [Get bookmark](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-bookmarks-bookmark)
- [Get bookmark collections](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-bookmarks-collections)
- [Get user bookmarks](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-bookmarks)
- [Get all collection items](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-collections-all)
- [Get collection items by id](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-collections-by-collection-id)
- [Get all collections](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-collections)
- [Generate timeline estimation](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-goals-estimate)
- [Get today's goal plan](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-goals-get-todays-plan)
- [Get notes by attached entity](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-notes-by-attached-entity)
- [Get note by ID](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-notes-by-note-id)
- [Get notes by verse range](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-notes-by-range)
- [Get notes by verse](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-notes-by-verse-by-verse-key)
- [Get notes count within verse range](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-notes-count-within-range)
- [Get all notes](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-notes)
- [Get user preferences](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-preferences)
- [Get user reading sessions](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-reading-sessions)
- [Get current streak days](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-streaks-current-streak-days)
- [Get streaks](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-streaks)
- [Get mutations](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-get-v-1-sync)
- [Update note by ID](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-patch-v-1-notes-by-note-id)
- [Add/update activity day](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-activity-days)
- [Add user bookmark](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-bookmarks)
- [Add collection Bookmark](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-collections-by-collection-id-bookmarks)
- [Update collection](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-collections-by-collection-id)
- [Add collection](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-collections)
- [Create a goal](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-goals)
- [Publish note](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-notes-by-note-id-publish)
- [Add note](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-notes)
- [Bulk add or update preferences](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-preferences-bulk)
- [Add or update preference](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-preferences)
- [Add or update user reading session](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-reading-sessions)
- [Sync local mutations](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-post-v-1-sync)
- [Update a goal](https://api-docs.quran.foundation/docs/user_related_apis_prelive/auth-put-v-1-goals-by-id)
- [Create a new comment](https://api-docs.quran.foundation/docs/user_related_apis_prelive/comments-controller-create)
- [Delete a comment](https://api-docs.quran.foundation/docs/user_related_apis_prelive/comments-controller-delete-comment)
- [Get replies to a comment](https://api-docs.quran.foundation/docs/user_related_apis_prelive/comments-controller-get)
- [Toggle like/unlike a comment](https://api-docs.quran.foundation/docs/user_related_apis_prelive/comments-controller-toggle-like)
- [Create post](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-create)
- [Delete post](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-delete)
- [Edit post](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-edit)
- [Export posts as PDF](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-export-multiple-posts)
- [Get posts feed](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-feed)
- [Get post by ID](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-find-one)
- [Get all post comments](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-get-all-comment)
- [Get post comments](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-get-comments)
- [Get post liked state](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-get-liked-state)
- [Get current user posts](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-get-loggedin-user-posts)
- [Get posts by verse](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-get-my-posts-by-verse)
- [Get posts count within range](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-get-my-posts-count-within-range)
- [Get related posts](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-get-related-posts)
- [Get user posts](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-get-user-post)
- [Report post abuse](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-report-abuse)
- [Toggle post like](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-toggle-like)
- [Toggle post save](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-toggle-save)
- [Track post view](https://api-docs.quran.foundation/docs/user_related_apis_prelive/posts-controller-view-tracking)
- [Accept room invite by private token](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-accept-by-private-token)
- [Accept room invite](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-accept-invite)
- [Update room admin access](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-admins-access)
- [Create a new group](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-create-new-group)
- [Create a new page](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-create-new-page)
- [Follow a page](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-follow-page)
- [Get room members](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-get-room-members)
- [Get room posts](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-get-room-posts)
- [Get room profile by ID](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-get-room-profile-by-id)
- [Get room profile by URL or subdomain](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-get-room-profile)
- [Get joined or managed rooms](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-get-rooms)
- [Invite user to room](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-invite-user-to-room)
- [Join a group](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-join-room)
- [Leave a group](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-leave-group)
- [Reject room invite](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-reject-invite)
- [Remove member from room](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-remove-member)
- [Search rooms](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-search-rooms)
- [Unfollow a page](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-unfollow-page)
- [Update a group](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-update-group)
- [Update a page](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-update-page)
- [Update post privacy in room](https://api-docs.quran.foundation/docs/user_related_apis_prelive/rooms-controller-update-post-privacy)
- [Search and retrieve tags](https://api-docs.quran.foundation/docs/user_related_apis_prelive/tags-controller-find)
- [User-related APIs](https://api-docs.quran.foundation/docs/user_related_apis_prelive/user-related-apis)
- [Edit user profile](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-edit-profile)
- [Get user followers](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-get-user-followers)
- [Get users followed by user](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-get-user-following)
- [Get user profile by id or username](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-get-user-profile)
- [Get user profile](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-profile)
- [Remove a follower](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-remove-follower)
- [Get logged-in user rooms](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-rooms)
- [Search for users](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-search)
- [Toggle follow/unfollow a user](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-toggle-follow)
- [Update user profile](https://api-docs.quran.foundation/docs/user_related_apis_prelive/users-controller-update-profile)

## OAuth2 APIs v1

- [OpenID Connect Userinfo](https://api-docs.quran.foundation/docs/oauth2_apis_versioned/get-oidc-user-info)
- [Introspect OAuth2 Access and Refresh Tokens](https://api-docs.quran.foundation/docs/oauth2_apis_versioned/introspect-o-auth-2-token)
- [OAuth 2.0 Authorize Endpoint](https://api-docs.quran.foundation/docs/oauth2_apis_versioned/o-auth-2-authorize)
- [OAuth2 APIs](https://api-docs.quran.foundation/docs/oauth2_apis_versioned/oauth-2-apis)
- [The OAuth 2.0 Token Endpoint](https://api-docs.quran.foundation/docs/oauth2_apis_versioned/oauth-2-token-exchange)
- [OpenID Connect Logout](https://api-docs.quran.foundation/docs/oauth2_apis_versioned/revoke-oidc-session)

## Search APIs v1

- [Quran.Foundation Search API](https://api-docs.quran.foundation/docs/search_apis_versioned/quran-foundation-search-api)
- [Search Quran content](https://api-docs.quran.foundation/docs/search_apis_versioned/search-controller-search)
- [Search](https://api-docs.quran.foundation/docs/search_apis_versioned/search)

## Tutorials

- [Frequently Asked Questions](https://api-docs.quran.foundation/docs/tutorials/faq)
- [Integrating Quran Font Rendering](https://api-docs.quran.foundation/docs/tutorials/fonts/font-rendering)
- [Page Layout API Guide](https://api-docs.quran.foundation/docs/tutorials/fonts/page-layout)
- [OAuth2 Client Configuration](https://api-docs.quran.foundation/docs/tutorials/oidc/client-setup)
- [OAuth2 Web Integration Example](https://api-docs.quran.foundation/docs/tutorials/oidc/example-integration)
- [OAuth 2.0 Tutorial – Quran Foundation API Authentication (PKCE)](https://api-docs.quran.foundation/docs/tutorials/oidc/getting-started-with-oauth2)
- [Android](https://api-docs.quran.foundation/docs/tutorials/oidc/mobile-apps/android)
- [iOS](https://api-docs.quran.foundation/docs/tutorials/oidc/mobile-apps/iOS)
- [Mobile Apps](https://api-docs.quran.foundation/docs/tutorials/oidc/mobile-apps)
- [React Native](https://api-docs.quran.foundation/docs/tutorials/oidc/mobile-apps/react-native)
- [OpenID Connect](https://api-docs.quran.foundation/docs/tutorials/oidc/openid-connect)
- [Quran Foundation User APIs OAuth2 Quickstart](https://api-docs.quran.foundation/docs/tutorials/oidc/user-apis-quickstart)
- [Getting Started with Data Sync](https://api-docs.quran.foundation/docs/tutorials/sync/getting-started)
- [Handling Sync Conflicts](https://api-docs.quran.foundation/docs/tutorials/sync/handling-conflicts)
- [Offline-First Architecture Patterns](https://api-docs.quran.foundation/docs/tutorials/sync/offline-first-patterns)

## JavaScript SDK

- [SDKs](https://api-docs.quran.foundation/sdk)
- [Audio API](https://api-docs.quran.foundation/sdk/javascript/audio)
- [Chapters API](https://api-docs.quran.foundation/sdk/javascript/chapters)
- [JavaScript SDK](https://api-docs.quran.foundation/sdk/javascript)
- [Juzs API](https://api-docs.quran.foundation/sdk/javascript/juzs)
- [Resources API](https://api-docs.quran.foundation/sdk/javascript/resources)
- [Search API](https://api-docs.quran.foundation/sdk/javascript/search)
- [Migration Guide](https://api-docs.quran.foundation/sdk/javascript/migration)
- [Verses API](https://api-docs.quran.foundation/sdk/javascript/verses)

## Auth Setup
# How to connect the quran.com oauth
## 1. Implement Quran Foundation OAuth2 client configuration for User APIs.

Goal
- Make OAuth2 client configuration and environment selection explicit and hard to misuse.

Environment variables (server-only)
- QF_CLIENT_ID (required)
- QF_CLIENT_SECRET (required on the backend for current Request Access clients; omit it only if Quran Foundation confirms that your client is public)
- QF_ENV (optional): "prelive" | "production" (default: "prelive")

Base URLs (copy exactly)
- Pre-Production:
  - Auth URL: https://prelive-oauth2.quran.foundation
  - API Base URL: https://apis-prelive.quran.foundation
- Production:
  - Auth URL: https://oauth2.quran.foundation
  - API Base URL: https://apis.quran.foundation

Implementation requirements
- Default to a frontend/native app + backend exchange pattern unless Quran Foundation explicitly confirms that the client is public.
- Make it explicit in code/comments whether this integration is using a public client or a confidential client.
- Create a config module (e.g., qfOAuthConfig.*) that:
  - reads QF_CLIENT_ID, QF_CLIENT_SECRET (optional), QF_ENV
  - maps QF_ENV => { authBaseUrl, apiBaseUrl }
- Never hardcode or log QF_CLIENT_SECRET.
- Never print credentials in errors.
- If QF_CLIENT_ID is missing, throw an error with EXACT message:
  "Missing Quran Foundation API credentials. Request access: https://api-docs.quran.foundation/request-access"

Output shape
- Export a function getQfOAuthConfig() that returns:
  { env, clientId, clientSecret, authBaseUrl, apiBaseUrl }

Acceptance checklist
- App boots with a clear error when QF_CLIENT_ID is missing.
- Switching QF_ENV switches both auth and API base URLs together.
- No logs ever contain client_secret.

## 2. Implement Authorization Code + PKCE authorization URL builder.

Goal
- Safely redirect users to /oauth2/auth with correct params (state/nonce/PKCE),
  and safely persist the PKCE verifier for the callback.

Source of truth
- Authorization endpoint path: /oauth2/auth
- Required query params:
  response_type=code
  client_id
  redirect_uri
  scope
  state
  nonce (required when requesting openid in many deployments)
  code_challenge
  code_challenge_method=S256

Implementation requirements
- Use authBaseUrl from getQfOAuthConfig():
  Redirect to {authBaseUrl}/oauth2/auth
- Generate:
  - code_verifier (random)
  - code_challenge = BASE64URL(SHA256(code_verifier))
  - state (random) and nonce (random)
- Persist { state, nonce, codeVerifier, redirectUri } server-side BEFORE redirect:
  - session store or secure httpOnly cookie
- On callback:
  - Validate state matches the persisted value (CSRF protection)
  - Use the persisted codeVerifier for token exchange
- Never log secrets. (PKCE verifier is sensitive; do not log it.)

Output shape
- Export a function buildAuthorizationUrl({ redirectUri, scopes? }) that returns:
  { url, state, nonce }
- Persist the codeVerifier internally (do not return it to the browser)

Acceptance checklist
- Redirect URL includes all required params.
- state is generated and later validated on callback.
- codeVerifier is stored server-side and used in Step 3 token exchange.
- No logs include codeVerifier, tokens, or client_secret.

## 3. Implement Authorization Code token exchange for Quran Foundation OAuth2.

Source of truth
- Token endpoint path: /oauth2/token
- Method: POST
- Content-Type: application/x-www-form-urlencoded
- grant_type: authorization_code
- Must send: code, redirect_uri, code_verifier (if PKCE was used)
- Public clients: include `client_id` in the body
- Confidential server clients: authenticate the client on the server

Implementation requirements
- Use authBaseUrl from getQfOAuthConfig():
  POST {authBaseUrl}/oauth2/token
- Default to the frontend/native app + backend exchange pattern unless Quran Foundation explicitly confirms that the client is public.
- Match the exchange method to the provisioned client type:
  - public => client_id in body, no client_secret
  - confidential => keep client_secret on the server and exchange on the server
- Validate callback inputs:
  - state must match stored value (CSRF protection)
  - redirect_uri must be exactly the one used in Step 2
  - server-initiated web flows: the PKCE `code_verifier` value must come from server storage when calling the token endpoint
  - frontend/native app + backend exchange flows: accept a `codeVerifier` field in the app's JSON callback payload, validate its presence, and forward it as `code_verifier` in the OAuth2 token request body
- Never log:
  - client_secret
  - authorization code
  - code_verifier
  - access_token / refresh_token / id_token
- On failure, throw a clear error:
  "Failed to exchange authorization code for tokens"

Output shape
- Export a function exchangeAuthorizationCode({ code, redirectUri, codeVerifier, isConfidential? }) that returns:
  { access_token, refresh_token?, id_token?, expires_in, scope, token_type }

Acceptance checklist
- Token exchange succeeds for public PKCE clients.
- Token exchange succeeds for confidential clients when client_secret is present.
- Frontend/native app + backend exchange flow accepts code + codeVerifier from the app and forwards code_verifier safely in the OAuth2 token request.
- Omitting client authentication for a confidential client produces invalid_client.
- Errors do not leak secrets, codes, or tokens.

## 4. Create an authenticated API client helper for Quran Foundation User APIs.

Headers (copy exactly)
- x-auth-token: <access token>
- x-client-id: <client id>

Implementation requirements (server-side)
- Build a client wrapper that automatically:
  - injects x-auth-token and x-client-id on every request
  - targets the correct API base URL from getQfOAuthConfig()
- For web apps, prefer making the resource call from your backend or proxy layer rather than from page JavaScript.
- If you intentionally make the resource call from browser code, the browser origin must still be accepted by the target service.

User API base
- Use apiBaseUrl from config:
  {apiBaseUrl}/auth/v1/...

Retry behavior
- If a request returns 401:
  - if a refresh_token is available, refresh access token once (Step 5)
  - retry the request once
  - if it still fails, surface the error (do not loop)

Logging rules
- Never log access tokens, refresh tokens, id tokens, or client_secret.
- Logging x-client-id is okay, but optional.

Acceptance checklist
- All outgoing requests include both required headers.
- A forced-expired token causes exactly one refresh + one retry (when refresh_token exists).
- No infinite refresh loops.

## 5. Implement refresh token handling for Quran Foundation OAuth2 (offline_access).

Source of truth
- Token endpoint path: /oauth2/token
- Method: POST
- Content-Type: application/x-www-form-urlencoded
- grant_type: refresh_token
- Must send refresh_token
- Public clients: include `client_id` in the body
- Confidential clients: use client authentication on the server
- Default to confidential/server-side refresh unless Quran Foundation explicitly confirms that the client is public

Implementation requirements
- Use authBaseUrl from getQfOAuthConfig():
  POST {authBaseUrl}/oauth2/token
- Keep confidential-client refresh on the server. Public/native clients should use secure device storage if no backend is involved.
- Store refresh_token securely:
  - Never store in localStorage in browsers
  - Prefer server sessions, encrypted storage, or httpOnly secure cookies (app-dependent)
- Never log refresh_token or access_token.
- Prevent refresh stampede per user/session:
  - If multiple requests refresh at once, only one refresh runs; others await it.
- Update stored access token + expiry (expires_in) after refresh.

Error handling
- On refresh failure, do not retry aggressively.
- Surface a clear error:
  "Failed to refresh access token"

Acceptance checklist
- Expired access_token triggers exactly one refresh (per session).
- Refreshed token is used for subsequent API calls.
- No logs contain tokens or client_secret.

## Harden environment selection and token isolation for Quran Foundation OAuth2.

Server-side
- Use QF_ENV ("prelive" | "production") to select BOTH:
  - authBaseUrl
  - apiBaseUrl
- Keep tokens isolated per environment:
  - never reuse a token from one env in the other
  - separate per-env token stores/caches/session keys
- Never log tokens (access/refresh/id) or client_secret.

Client-side
- Public clients (SPA/mobile) MUST use PKCE and must not use client_secret.
- Prefer server-side backend to hold refresh tokens securely.

Acceptance checklist
- Switching QF_ENV changes BOTH auth and API bases.
- Tokens are stored/used per environment and never mixed.
- Logs remain free of secrets and tokens.

## Add safe error handling for OAuth2 and User API calls.

OAuth2 errors
- invalid_client: wrong client type, using a public-client example with a confidential client, missing secret for a confidential client, wrong client_id/secret, or wrong environment
- invalid_grant: code/refresh_token invalid, expired, already used, or clock skew
- redirect_uri_mismatch: redirect URI differs from registered value
- invalid_scope: scope is misspelled or not allowed

User API errors
- 401: missing/expired token:
  - refresh once (if refresh_token exists), retry once
  - if still failing, require re-auth (do not loop)
- 403: browser origin not allowlisted:
  - move the resource call to your backend, or use an origin the target service allows
- 403: scope/permission not granted:
  - hide/disable feature and prompt user for correct consent

Logging rules
- Never log:
  - authorization codes
  - code_verifier
  - access_token / refresh_token / id_token
  - client_secret
- Log only safe diagnostics:
  - environment (prelive/production)
  - request path (no query secrets)
  - status code
  - short sanitized error body (if present)

Acceptance checklist
- Errors are actionable (status + hint) without leaking secrets.
- No infinite token refresh loops.

## Frequently Asked Questions
What scopes should I request for Quran Foundation OAuth2?
Use openid offline_access for authentication-only flows. If your app will call User APIs like the collections examples in this guide, request the corresponding API scopes as well, such as user and collection. Follow the principle of least privilege — only request additional scopes for things like user profile, bookmarks, collections, and similar features when your app actually needs them.

How long do Quran Foundation access tokens last?
Access tokens expire after 1 hour (3,600 seconds). Use the refresh_token (granted via the offline_access scope) to obtain a new access token without requiring the user to log in again. See Step 5: Refresh the Access Token for implementation details.

Can I use the same tokens across pre-production and production?
No. Tokens issued in the pre-production environment (prelive-oauth2.quran.foundation) will not work against the production API (apis.quran.foundation), and vice versa. Always ensure your authBaseUrl and apiBaseUrl point to the same environment.

Environment	Auth URL	API Base URL
Pre-Production	https://prelive-oauth2.quran.foundation	https://apis-prelive.quran.foundation
Production	https://oauth2.quran.foundation	https://apis.quran.foundation
What is the difference between public and confidential OAuth2 clients?
Confidential clients have a client_secret that is stored securely on a backend server and used during token exchange and refresh. This is the default for clients issued through Request Access.

Public clients (SPAs, mobile apps) rely solely on PKCE for security and never use a client_secret. Your client is public only if Quran Foundation has explicitly confirmed it.

If you're unsure, assume your client is confidential and use the backend exchange pattern described in Step 3.

What headers do I need to call Quran Foundation User APIs?
Every request to User APIs requires two custom headers:

x-auth-token: YOUR_ACCESS_TOKEN
x-client-id: YOUR_CLIENT_ID

For web apps, your backend or serverless proxy should usually be the component that sends these headers to Quran Foundation. See Step 4: Call User APIs with Headers for complete examples in cURL, JavaScript, and Python.

I'm getting invalid_client — what's wrong?
This usually means you're using some variant of the public client token exchange flow (sending client_id in the request body without a secret) when your client was actually confidential. For confidential clients, the token exchange must be authenticated on the server with the client secret. Check the Troubleshooting table for more details.


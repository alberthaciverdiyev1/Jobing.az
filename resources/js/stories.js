const SEEN_KEY = 'story_viewed_ids';
const PENDING_KEY = 'story_pending_views';
const IMAGE_DURATION = 5000;

function readIds(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');

        return Array.isArray(value) ? value : [];
    } catch (e) {
        return [];
    }
}

function writeIds(key, ids) {
    try {
        localStorage.setItem(key, JSON.stringify(ids));
    } catch (e) {
        // Storage may be unavailable (private mode); viewing still works.
    }
}

export default function storyViewer() {
    return {
        rings: [],
        isOpen: false,
        ringIndex: 0,
        storyIndex: 0,
        progress: 0,
        timer: null,
        isAuth: false,
        viewBase: '',

        init() {
            try {
                const raw = this.$el.dataset.stories;
                this.rings = raw ? JSON.parse(raw) : [];
            } catch (e) {
                this.rings = [];
            }

            this.isAuth = this.$el.dataset.auth === '1';
            this.viewBase = (this.$el.dataset.viewBase || '/stories').replace(/\/+$/, '');

            if (! this.isAuth) {
                this.applyLocalSeen();
            }
        },

        get currentRing() {
            return this.rings[this.ringIndex] || { stories: [] };
        },

        get currentStory() {
            return this.currentRing.stories[this.storyIndex] || null;
        },

        openRing(index) {
            if (! this.rings[index]) {
                return;
            }

            this.ringIndex = index;
            const firstUnviewed = this.rings[index].stories.findIndex((story) => ! story.viewed);
            this.storyIndex = firstUnviewed === -1 ? 0 : firstUnviewed;
            this.isOpen = true;
            document.body.classList.add('overflow-hidden');
            this.startStory();
        },

        startStory() {
            this.stopTimers();
            this.progress = 0;

            const story = this.currentStory;

            if (! story) {
                this.close();

                return;
            }

            this.markViewed(story);

            if (story.type === 'video') {
                this.$nextTick(() => {
                    const video = this.$refs.video;

                    if (! video) {
                        return;
                    }

                    try {
                        video.load();
                    } catch (e) {
                        // Autoplay/load errors are non-fatal for the viewer.
                    }

                    const playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(() => {
                            // Browsers may block unmuted autoplay; retry muted so the story still plays.
                            video.muted = true;
                            video.play().catch(() => {});
                        });
                    }
                });

                return;
            }

            const startedAt = Date.now();
            this.timer = setInterval(() => {
                this.progress = Math.min(100, ((Date.now() - startedAt) / IMAGE_DURATION) * 100);

                if (this.progress >= 100) {
                    this.next();
                }
            }, 50);
        },

        onVideoTimeUpdate(event) {
            const video = event.target;

            if (video.duration && Number.isFinite(video.duration)) {
                this.progress = Math.min(100, (video.currentTime / video.duration) * 100);
            }
        },

        next() {
            const ring = this.currentRing;

            if (! ring || ! ring.stories.length) {
                this.close();

                return;
            }

            if (this.storyIndex < ring.stories.length - 1) {
                this.storyIndex++;

                return this.startStory();
            }

            if (this.ringIndex < this.rings.length - 1) {
                this.ringIndex++;
                this.storyIndex = 0;

                return this.startStory();
            }

            this.close();
        },

        prev() {
            if (this.storyIndex > 0) {
                this.storyIndex--;

                return this.startStory();
            }

            if (this.ringIndex > 0) {
                this.ringIndex--;
                this.storyIndex = Math.max(0, this.rings[this.ringIndex].stories.length - 1);

                return this.startStory();
            }

            this.startStory();
        },

        close() {
            this.stopTimers();
            this.isOpen = false;
            this.progress = 0;
            document.body.classList.remove('overflow-hidden');
        },

        stopTimers() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }

            const video = this.$refs.video;
            if (video) {
                try {
                    video.pause();
                } catch (e) {
                    // Nothing to pause.
                }
            }
        },

        /**
         * Hər açılış bir baxış sayılır (Telegram günlük ziyarət statistikası kimi).
         * "Görülüb" vəziyyəti isə hələ də unikaldır — həlqə boz rəngə keçir.
         */
        markViewed(story) {
            story.viewed = true;

            const ring = this.rings[this.ringIndex];
            if (ring) {
                ring.viewed = ring.stories.every((item) => item.viewed);
            }

            this.recordView(story.id);
        },

        recordView(storyId) {
            if (! storyId) {
                return;
            }

            if (this.isAuth) {
                const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';

                fetch(`${this.viewBase}/${storyId}/view`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrf,
                    },
                }).catch(() => {});

                return;
            }

            // Giriş etməmiş istifadəçi üçün hər baxış ayrıca saxlanılır;
            // giriş edəndə hamısı hesabına köçürülür.
            const pending = readIds(PENDING_KEY);
            pending.push(storyId);
            writeIds(PENDING_KEY, pending);

            const seen = readIds(SEEN_KEY);
            if (! seen.includes(storyId)) {
                seen.push(storyId);
                writeIds(SEEN_KEY, seen);
            }
        },

        applyLocalSeen() {
            const seen = new Set(readIds(SEEN_KEY));

            if (seen.size === 0) {
                return;
            }

            this.rings.forEach((ring) => {
                ring.stories.forEach((story) => {
                    if (seen.has(story.id)) {
                        story.viewed = true;
                    }
                });

                ring.viewed = ring.stories.every((story) => story.viewed);
            });
        },
    };
}

export function syncPendingStoryViews() {
    if (! window.storyAuth || ! window.storySyncUrl) {
        return;
    }

    // Hər təkrar bir baxışdır; köhnə versiyadan qalan unikal siyahı da köçürülür.
    let pending = readIds(PENDING_KEY);

    if (pending.length === 0) {
        pending = readIds(SEEN_KEY);
    }

    if (pending.length === 0) {
        return;
    }

    const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const batch = pending.slice(0, 200);

    fetch(window.storySyncUrl, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrf,
        },
        body: JSON.stringify({ ids: batch }),
    })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
            if (! data || ! data.success) {
                return;
            }

            const remaining = pending.slice(batch.length);

            writeIds(PENDING_KEY, remaining);

            try {
                if (remaining.length === 0) {
                    localStorage.removeItem(SEEN_KEY);
                }
            } catch (e) {
                // Storage may be unavailable; server-side views are already saved.
            }
        })
        .catch(() => {});
}

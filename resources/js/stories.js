const STORAGE_KEY = 'story_viewed_ids';
const IMAGE_DURATION = 5000;

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
        },

        get currentRing() {
            return this.rings[this.ringIndex] || { stories: [] };
        },

        get currentStory() {
            return this.currentRing.stories[this.storyIndex] || null;
        },

        openRing(index) {
            if (!this.rings[index]) {
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

        markViewed(story) {
            if (story.viewed) {
                return;
            }

            story.viewed = true;

            const ring = this.rings[this.ringIndex];
            if (ring) {
                ring.viewed = ring.stories.every((item) => item.viewed);
            }

            if (this.isAuth && story.id) {
                const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';

                fetch(`${this.viewBase}/${story.id}/view`, {
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

            this.rememberLocally(story.id);
        },

        rememberLocally(storyId) {
            try {
                const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

                if (! Array.isArray(ids)) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify([storyId]));

                    return;
                }

                if (! ids.includes(storyId)) {
                    ids.push(storyId);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
                }
            } catch (e) {
                // Storage may be unavailable (private mode); viewing still works.
            }
        },
    };
}

export function syncPendingStoryViews() {
    if (! window.storyAuth || ! window.storySyncUrl) {
        return;
    }

    let ids = [];

    try {
        ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
        ids = [];
    }

    if (! Array.isArray(ids) || ids.length === 0) {
        return;
    }

    const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const batch = ids.slice(0, 200);

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

            const remaining = ids.slice(batch.length);

            try {
                if (remaining.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (e) {
                // Storage may be unavailable; server-side views are already saved.
            }
        })
        .catch(() => {});
}

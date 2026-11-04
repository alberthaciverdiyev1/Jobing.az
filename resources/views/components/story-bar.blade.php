@if($storyRings->isNotEmpty())
<div
    x-data="storyViewer"
    data-stories="{{ json_encode($storyRings) }}"
    data-auth="{{ auth()->check() ? '1' : '0' }}"
    data-view-base="{{ url('/stories') }}"
    class="bg-white border-b border-gray-200/80"
>
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-start gap-3 sm:gap-5 overflow-x-auto py-3 story-scroll">
            @foreach($storyRings as $ring)
                <button
                    type="button"
                    @click="openRing({{ $loop->index }})"
                    class="group flex flex-col items-center gap-1.5 shrink-0 w-[74px] focus:outline-none"
                    title="{{ $ring['name'] }}"
                    aria-label="{{ __('View story: :name', ['name' => $ring['name']]) }}"
                >
                    <span class="relative p-[2.5px] rounded-full bg-gradient-to-tr {{ $ring['viewed'] ? 'from-gray-300 via-gray-200 to-gray-300' : 'from-orange-500 via-rose-500 to-violet-500' }} transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                        <span class="relative block p-[2px] bg-white rounded-full">
                            @if($ring['thumb'])
                                <img src="{{ $ring['thumb'] }}" alt="{{ $ring['name'] }}" class="w-14 h-14 rounded-full object-cover" loading="lazy">
                                @if($ring['avatar'])
                                    <img src="{{ $ring['avatar'] }}" alt="" class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full object-cover ring-2 ring-white bg-white">
                                @endif
                            @elseif($ring['avatar'])
                                <img src="{{ $ring['avatar'] }}" alt="{{ $ring['name'] }}" class="w-14 h-14 rounded-full object-cover" loading="lazy">
                            @else
                                <span class="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-semibold">
                                    {{ $ring['initial'] }}
                                </span>
                            @endif
                        </span>
                    </span>
                    <span class="text-[11px] leading-tight text-gray-600 text-center truncate w-full">{{ $ring['name'] }}</span>
                </button>
            @endforeach
        </div>
    </div>

    <template x-teleport="body">
        <div
            x-show="isOpen"
            x-cloak
            @keydown.window.escape="close()"
            @keydown.window.arrow-right.prevent="isOpen && next()"
            @keydown.window.arrow-left.prevent="isOpen && prev()"
            class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            <button
                type="button"
                @click="close()"
                class="absolute top-4 right-4 z-40 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white/90 hover:bg-black/60 transition cursor-pointer"
                aria-label="{{ __('Close') }}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>

            <button
                type="button"
                @click="prev()"
                class="hidden sm:inline-flex absolute left-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="{{ __('Previous') }}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            <button
                type="button"
                @click="next()"
                class="hidden sm:inline-flex absolute right-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="{{ __('Next') }}"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>

            <div class="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:w-[420px] sm:aspect-[9/16] overflow-hidden bg-black sm:rounded-2xl shadow-2xl">
                <div class="absolute top-0 inset-x-0 z-20 flex gap-1 p-2.5">
                    <template x-for="(story, idx) in currentRing.stories" :key="story.id">
                        <div class="h-[3px] flex-1 rounded-full bg-white/30 overflow-hidden">
                            <div
                                class="h-full bg-white transition-[width] duration-100 ease-linear"
                                :style="`width: ${idx < storyIndex ? 100 : (idx === storyIndex ? progress : 0)}%`"
                            ></div>
                        </div>
                    </template>
                </div>

                <div class="absolute top-5 inset-x-0 z-20 flex items-center gap-2.5 px-3.5 pt-2">
                    <template x-if="currentRing.avatar">
                        <img :src="currentRing.avatar" :alt="currentRing.name" class="w-9 h-9 rounded-full object-cover ring-2 ring-white/20">
                    </template>
                    <template x-if="! currentRing.avatar">
                        <span class="w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center text-sm font-semibold" x-text="currentRing.initial"></span>
                    </template>
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-white truncate" x-text="currentRing.name"></p>
                        <p class="text-[11px] text-white/60" x-text="currentStory ? currentStory.time : ''"></p>
                    </div>
                </div>

                <div class="absolute inset-0 flex items-center justify-center">
                    <template x-if="currentStory && currentStory.type === 'image'">
                        <img :src="currentStory.src" :alt="currentRing.name" class="w-full h-full object-contain select-none" draggable="false">
                    </template>

                    <template x-if="currentStory && currentStory.type === 'video'">
                        <video
                            x-ref="video"
                            :src="currentStory.src"
                            :poster="currentStory.thumb || ''"
                            class="w-full h-full object-contain"
                            playsinline
                            preload="auto"
                            @timeupdate="onVideoTimeUpdate($event)"
                            @ended="next()"
                        ></video>
                    </template>
                </div>

                <div class="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" @click="prev()"></div>
                <div class="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer" @click="next()"></div>

                <div x-show="currentStory && currentStory.link" x-cloak class="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <a
                        :href="currentStory ? currentStory.link : '#'"
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-gray-100 transition"
                    >
                        <span>{{ __('Learn more') }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </template>
</div>
@endif

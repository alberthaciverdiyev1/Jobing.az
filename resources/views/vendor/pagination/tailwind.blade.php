@if ($paginator->hasPages())
    <div class="flex flex-col items-center justify-center my-6">
        <nav role="navigation" aria-label="{{ __('Səhifələmə') }}">
            <ul class="inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-white shadow-2xs">
                {{-- Previous Page Link --}}
                @if ($paginator->onFirstPage())
                    <li aria-disabled="true" aria-label="{{ __('Əvvəlki') }}">
                        <span class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-300 bg-gray-50/60 cursor-not-allowed text-xs select-none">
                            <i class="fas fa-chevron-left text-[11px]"></i>
                        </span>
                    </li>
                @else
                    <li>
                        <a href="{{ $paginator->previousPageUrl() }}" rel="prev" aria-label="{{ __('Əvvəlki') }}"
                           class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-700 bg-white hover:bg-orange-50 hover:text-primary transition text-xs font-bold shadow-2xs hover:shadow-xs">
                            <i class="fas fa-chevron-left text-[11px]"></i>
                        </a>
                    </li>
                @endif

                {{-- Pagination Elements --}}
                @foreach ($elements as $element)
                    {{-- "Three Dots" Separator --}}
                    @if (is_string($element))
                        <li aria-disabled="true">
                            <span class="w-7 h-9 sm:w-8 sm:h-10 flex items-center justify-center text-gray-400 font-bold text-xs select-none">
                                {{ $element }}
                            </span>
                        </li>
                    @endif

                    {{-- Array Of Links --}}
                    @if (is_array($element))
                        @foreach ($element as $page => $url)
                            @if ($page == $paginator->currentPage())
                                <li aria-current="page">
                                    <span class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-primary text-white font-extrabold text-xs shadow-xs select-none">
                                        {{ $page }}
                                    </span>
                                </li>
                            @else
                                <li>
                                    <a href="{{ $url }}"
                                       class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-700 bg-white hover:bg-orange-50 hover:text-primary transition text-xs font-semibold shadow-2xs hover:shadow-xs">
                                        {{ $page }}
                                    </a>
                                </li>
                            @endif
                        @endforeach
                    @endif
                @endforeach

                {{-- Next Page Link --}}
                @if ($paginator->hasMorePages())
                    <li>
                        <a href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="{{ __('Növbəti') }}"
                           class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-700 bg-white hover:bg-orange-50 hover:text-primary transition text-xs font-bold shadow-2xs hover:shadow-xs">
                            <i class="fas fa-chevron-right text-[11px]"></i>
                        </a>
                    </li>
                @else
                    <li aria-disabled="true" aria-label="{{ __('Növbəti') }}">
                        <span class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-300 bg-gray-50/60 cursor-not-allowed text-xs select-none">
                            <i class="fas fa-chevron-right text-[11px]"></i>
                        </span>
                    </li>
                @endif
            </ul>
        </nav>

        {{-- Results Info Under Pagination --}}
        <p class="text-xs text-gray-400 mt-2.5 text-center select-none">
            {!! __('Cəmi :total nəticədən :first - :last arası göstərilir', [
                'first' => '<span class="font-bold text-gray-700">' . $paginator->firstItem() . '</span>',
                'last' => '<span class="font-bold text-gray-700">' . $paginator->lastItem() . '</span>',
                'total' => '<span class="font-bold text-primary">' . $paginator->total() . '</span>'
            ]) !!}
        </p>
    </div>
@endif

@if ($paginator->hasPages())
    <div class="flex flex-col items-center justify-center my-6 w-full max-w-full">
        <nav role="navigation" aria-label="{{ __('Pagination') }}" class="-mx-4 px-4 w-full max-w-full overflow-x-auto sm:mx-0 sm:px-0">
            <ul class="flex items-center justify-center gap-0.5 sm:gap-1.5 p-1 rounded-2xl bg-white shadow-2xs min-w-max mx-auto">
                @if ($paginator->onFirstPage())
                    <li aria-disabled="true" aria-label="{{ __('Previous') }}">
                        <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-300 bg-gray-50/60 cursor-not-allowed text-xs select-none">
                            <i class="fas fa-chevron-left text-[12px]"></i>
                        </span>
                    </li>
                @else
                    <li>
                        <a href="{{ $paginator->previousPageUrl() }}" rel="prev" aria-label="{{ __('Previous') }}"
                           class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-700 bg-white hover:bg-orange-50 hover:text-primary transition text-xs font-semibold shadow-2xs hover:shadow-xs">
                            <i class="fas fa-chevron-left text-[12px]"></i>
                        </a>
                    </li>
                @endif

                @foreach ($elements as $element)
                    @if (is_string($element))
                        <li aria-disabled="true">
                            <span class="w-7 h-8 sm:w-8 sm:h-10 flex items-center justify-center text-gray-400 font-semibold text-xs select-none">
                                {{ $element }}
                            </span>
                        </li>
                    @endif

                    @if (is_array($element))
                        @foreach ($element as $page => $url)
                            @if ($page == $paginator->currentPage())
                                <li aria-current="page">
                                    <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-primary text-white font-semibold text-xs shadow-xs select-none">
                                        {{ $page }}
                                    </span>
                                </li>
                            @else
                                <li>
                                    <a href="{{ $url }}"
                                       class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-700 bg-white hover:bg-orange-50 hover:text-primary transition text-xs font-semibold shadow-2xs hover:shadow-xs">
                                        {{ $page }}
                                    </a>
                                </li>
                            @endif
                        @endforeach
                    @endif
                @endforeach

                @if ($paginator->hasMorePages())
                    <li>
                        <a href="{{ $paginator->nextPageUrl() }}" rel="next" aria-label="{{ __('Next') }}"
                           class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-700 bg-white hover:bg-orange-50 hover:text-primary transition text-xs font-semibold shadow-2xs hover:shadow-xs">
                            <i class="fas fa-chevron-right text-[12px]"></i>
                        </a>
                    </li>
                @else
                    <li aria-disabled="true" aria-label="{{ __('Next') }}">
                        <span class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-gray-300 bg-gray-50/60 cursor-not-allowed text-xs select-none">
                            <i class="fas fa-chevron-right text-[12px]"></i>
                        </span>
                    </li>
                @endif
            </ul>
        </nav>

        <p class="text-xs text-gray-400 mt-2.5 text-center select-none">
            {!! __('Showing :first - :last of :total results', [
                'first' => '<span class="font-semibold text-gray-700">' . $paginator->firstItem() . '</span>',
                'last' => '<span class="font-semibold text-gray-700">' . $paginator->lastItem() . '</span>',
                'total' => '<span class="font-semibold text-primary">' . $paginator->total() . '</span>'
            ]) !!}
        </p>
    </div>
@endif

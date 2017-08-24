(function ($) {
    var _canHover = false;

    var toggleHoverCard = function (event) {
        var link = $(this),
            card = link.closest('.hover-card'),
            isVisible = card.hasClass('active'),
            details = link.siblings('.hover-detail'),
            detailPath = link.data('detailPath'),
            detailCallbackName = link.data('detailCallback'),
            detailCallback;

        var insertDetails = function (html) {
            if (html === 'An unexpected error has occurred.') {
                return;
            }

            toggleHoverCard.call(link.after(html), event);
        };

        // Detail content is already available
        if (details.length !== 0 && (event.type !== 'mouseenter' || !isVisible)) {

            // Hide all tool tips
            $('.hover-card.active').removeClass('active');

            // Show this tool tip
            if (!isVisible) {
                // Center hover card over the hover target
                if (!details.is('.slide-left, .slide-right, .right-positioned')) {
                    details.addClass('no-transition');
                    details.css('left', (link.outerWidth() / 2 + parseInt(link.css('margin-left'), 10)) + 'px').height(); // Trigger a re-flow
                    details.removeClass('no-transition');
                }

                card.parents(':not(.lightbox-content).scrollable, :not(.lightbox-content).scrollable-horizontal').first().css('padding-bottom', '400px');
                card.addClass('active');
            }

            return;
        }

        // Pull the detail content from the detail path provided
        if (detailPath != null && detailPath.length !== 0) {
            $.ajax({
                url: STRATUS.getStratusHost() + detailPath,
                type: 'GET',
                dataType: 'html',
                data: null,
                success: insertDetails,
                error: function () {
                    // Don't show error message if this fails.
                }
            });

            return;
        }

        // Call the provided function to build the detail content
        if (detailCallbackName != null && detailCallbackName.length !== 0) {
            detailCallback = eval(detailCallbackName);

            if (typeof detailCallback === 'function') {
                detailCallback.call(this, insertDetails);
            }
        }
    };

    var hideHoverCards = function (event) {
        var target = $(event.target);

        // Hide hover cards
        if (!target.is('.hover-card > a, .hover-card > .hover-target')) {
            // TODO: Create class for static hover cards instead of using #password-rules here
            $('.hover-card.active:not(#password-rules)').removeClass('active').parents('.scrollable, .scrollable-horizontal').first().css('padding-bottom', '');
        }
    };

    // This is kind of weird, but also brilliant. There's no reliable way to know if the user can hover,
    // so if the "mouseenter" event is ever fired, we unbind the "click" event and rely on "mouseenter" only
    $(document).one('mouseenter.hover-card', function () {
        _canHover = true;
        $(document).off('click.hover-card', '.hover-card > a, .hover-card > .hover-target');
    });

    $(document).on('click.hover-card', hideHoverCards);
    $(window).on('resize.hover-card', hideHoverCards);

    $.fn.hoverCard = function () {
        return this.each(function () {
            var obj = $(this).addClass('hover-card'),
                isInitialized = obj.hasClass('js-hover-card-initialized');

            if (isInitialized) {
                return;
            }

            obj.on(_canHover ? 'mouseenter.hover-card' : 'mouseenter.hover-card click.hover-card', 'a, .hover-target', toggleHoverCard);
            obj.on('mouseleave.hover-card', function () {
                obj.removeClass('active');
                obj.parents('.scrollable, .scrollable-horizontal').first().css('padding-bottom', '');
            });

            obj.addClass('js-hover-card-initialized');
        });
    };
})(jQuery);

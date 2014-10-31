$(function() {
    // search elements that has 'form' attribute
    var elements = $("[form]");
    if (!elements.length) {
        // no elements found, no need to fix
        return;
    }
    // detect if browser supports this
    if (elements.get(0).form instanceof HTMLFormElement) {
        // browser supports, no need to fix
        return;
    }
    // OK, here we go.
    elements.each(function() {
        var e = $(this), that = this,
            tag = this.tagName.toLowerCase(),
            targetForm = $("#" + e.attr('form'));

        //button
        var action;
        if (tag === "input" && this.type && (action = this.type.match(/^(reset|submit)$/i))) {
            e.on('click', function() {
                targetForm.trigger(action[0]); // reset or submit
            });
        } else if (tag.match(/^(select|textarea|option)$/i)) {
            targetForm.on('submit', function() {
                var IDENTIFYER = "__copied__",
                    copy = e.clone().addClass(IDENTIFYER).hide().val(e.val()).text(e.text());
                // remove previous copied elements
                $(this).find("." + IDENTIFYER).remove();
                // clone a copy to target form, and make it invisible
                $(this).append(copy);
            });
        }
    });
});

// prevent submition
// $("form").on("submit", function(){return false});
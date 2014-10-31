$(function() {
    // search elements that has 'form' attribute
    var elements = $("[form]");
    if (!elements.length) {
        // no elements found, no need to fix
        return;
    }
    // detect if browser supports this
    if (elements.get(0).form instanceof HTMLFormElement) {
        // browser supports it, no need to fix
        return;
    }
    var _IDENTIFYER = "__copied__";
    // OK, here we go.
    elements.each(function() {
        var e = $(this), that = this,
            tag = this.tagName.toLowerCase(),
            targetForm = $("#" + e.attr('form'));

        var type;
        if (tag === "input" && this.type && (type = this.type.match(/^(reset|submit)$/i))) {
            //button
            e.on('click', function() {
                if (this.value) {
                    targetForm.append(
                        $('<input>').attr('type', 'hidden').addClass(_IDENTIFYER).attr('name', this.name).val(this.value)
                    );
                }
                targetForm.trigger(action[0]); // reset or submit
            });
        } else if (tag.match(/^(select|textarea|option|input)$/)) {
            // input
            targetForm.on('submit', function() {
                var $form = $(this);
                // remove previous copied elements
                $form.find("." + _IDENTIFYER).remove();
                // clone a copy to target form, and make it invisible
                var copy = e.clone().addClass(_IDENTIFYER).hide().val(e.val()).text(e.text());
                $form.append(copy);
            });
        }
    });
});
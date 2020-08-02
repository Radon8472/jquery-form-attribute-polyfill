(function($) {
    /**
     * polyfill for html5 form attr
     */

        // detect if browser supports this
    var sampleElement = $('[form]').get(0);
    var isIE11 = !(window.ActiveXObject) && "ActiveXObject" in window;
    if (sampleElement && window.HTMLFormElement && sampleElement.form instanceof HTMLFormElement && !isIE11) {
        // browser supports it, no need to fix
        return;
    }

    /**
     * Append a field to a form
     *
     */
    $.fn.appendField = function(data) {
        // for form only
        if (!this.is('form')) return;

        // wrap data
        if (!$.isArray(data) && data.name && data.value) {
            data = [data];
        }

        var $form = this;

        // attach new params
        $.each(data, function(i, item) {
            $('<input/>')
                .attr('type', 'hidden')
                .attr('name', item.name)
                .val(item.value).appendTo($form);
        });

        return $form;
    };

    /**
     * Find all input fields with form attribute point to jQuery object
     *
     */
    $('form[id]').submit(function(e) {
        var $form = $(this);
        // serialize data
        var data = $('[form='+ $form.attr('id') + ']').serializeArray();
        // append data to form
        $form.appendField(data);
    }).each(function() {
        var form = this,
            $form = $(form),
            $fields = $('[form=' + $form.attr('id') + ']');


        // add the 'submit()' method to all elements outside of the form
        $fields.each(function(i, item) {
            item.submit = function() {
                $(form).submit();
            };
        });


        $fields.filter('button, input').filter('[type=reset],[type=submit]').click(function() {
            var type = this.type.toLowerCase();
            if (type === 'reset') {
                // reset form
                form.reset();
                // for elements outside form
                $fields.each(function() {
                    this.value = this.defaultValue;
                    this.checked = this.defaultChecked;
                }).filter('select').each(function() {
                    $(this).find('option').each(function() {
                        this.selected = this.defaultSelected;
                    });
                });
            } else if (type.match(/^submit|image$/i)) {
                $(form).appendField({name: this.name, value: this.value}).submit();
            }
        });
    });


})(jQuery);
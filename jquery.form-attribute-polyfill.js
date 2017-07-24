(function($) {
    /**
     * polyfill for html5 form attr
     */

        // detect if browser supports this
    var SAMPLE_FORM_NAME = "html-5-polyfill-test";
    var sampleForm = $("<form id='" + SAMPLE_FORM_NAME + "'/>");
    var sampleFormAndHiddenInput = sampleForm.add($("<input type='hidden' form='" + SAMPLE_FORM_NAME + "'/>"));
    sampleFormAndHiddenInput.prependTo('body');
    var sampleElementFound = sampleForm[0].elements[0];
    sampleFormAndHiddenInput.remove();
    if (sampleElementFound) {
        // browser supports it, no need to fix
        return;
    }

    /**
     * Append a field to a form
     *
     */
    var CLASS_NAME_POLYFILL_MARKER = "html-5-polyfill-form-attr-marker";
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
                .attr('class', CLASS_NAME_POLYFILL_MARKER)
                .val(item.value).appendTo($form);
        });

        return $form;
    };

    /**
     * Find all input fields with form attribute point to jQuery object
     *
     */
    $('form[id]').submit(function(e, origSubmit) {
        // clean up form from last submit
        $('.'+CLASS_NAME_POLYFILL_MARKER, this).remove();
        // serialize data
        var data = $('[form='+ this.id + ']').serializeArray();
        // add data from external submit, if needed:
        if (origSubmit && origSubmit.name)
            data.push({name: origSubmit.name, value: origSubmit.value})
        // append data to form
        $(this).appendField(data);
    })

//submit and reset behaviour
    $('button[type=reset], input[type=reset]').click(function() {
        //extend reset buttons to fields with matching form attribute
        // reset form
        var formId = $(this).attr("form");
        var formJq = $('#'+formId);
        if (formJq.length)
            formJq[0].reset();
        // for elements outside form
        if (!formId)
            formId = $(this).closest("form").attr("id");
        $fields = $('[form=' + formId + ']');
        $fields.each(function() {
            this.value = this.defaultValue;
            this.checked = this.defaultChecked;
        }).filter('select').each(function() {
            $(this).find('option').each(function() {
                this.selected = this.defaultSelected;
            });
        });
    });
    $('button[type=submit], input[type=submit], input[type=image]').click(function() {
        var formId = $(this).attr("form") || $(this).closest("form").attr("id");
        $('#'+formId).trigger('submit', this);  //send clicked submit as extra parameter
    });
})(jQuery);
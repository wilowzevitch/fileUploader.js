/**
 * FileUploader.js
 * Author: Tisserand David
 * v1.2 2023-12-14
 * 
 * Need JQuery
 * 
 */


function FileUploader(item, options) {

    this.item = $(item);

    if (!this.item.length) {
        console.log('Empty item');
        return false;
    }

    var options = options || [];

    /* Default Config */
    var defaults = {
        url: false,
        multiple: true,
        before: false,
        processing: false,
        success: false,
        error: false
    };

    /* Construct */
    this.options = $.extend({}, defaults, options);

    /* Control required field */
    if (!this.options.url) {
        console.log('Missing data');
        return false;
    }

    that = this;
    this.item.on('change', function(e) {
        if (that.options.multiple) {
            for (var i = 0; i < $(this)[0].files.length; i++) {
                that.file = $(this)[0].files[i];
                that.upload(e.target);
            }
        } else {
            that.file = $(this)[0].files[0];
            that.upload(e.target);
        }
    })
}

FileUploader.prototype.getType = function() {
    return this.file.type;
};

FileUploader.prototype.getSize = function() {
    return this.file.size;
};

FileUploader.prototype.getName = function() {
    return this.file.name;
};

FileUploader.prototype.upload = function (item) {
    var that = this;
    var formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("file", this.file, this.getName());

    if (this.options.before && typeof this.options.before === 'function') {
        const success = this.options.before(formData, item, this.file);
        if (!success) {
            return false;
        }
    }

    $.ajax({
        method: "POST",
        type: "POST",   // For JQuery < 1.9
        url: this.options.url,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload && that.options.processing && typeof that.options.processing === 'function') {
                myXhr.upload.processing = that.options.processing;
                myXhr.upload.itemProcessing = item;
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }
            return myXhr;
        },
        success: function (data) {
            that.item.val('');
            if (that.options.success && typeof that.options.success == 'function')
                that.options.success(data, item, that.file);
        },
        error: function (error) {
            if (that.options.error && typeof that.options.error == 'function')
                that.options.error(data, item, that.file);
        },
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    });
};

FileUploader.prototype.progressHandling = function (event) {
    var that = this;
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    if (event.lengthComputable) {
        percent = Math.ceil(position / total * 100);
    }
    event.currentTarget.processing(percent, event, event.currentTarget.itemProcessing);
};

$.fn.fileUploader = function(options) {
    return this.each(function() {
        new FileUploader(this,options);
    });
};

$.fn.fileUploader.Constructor = FileUploader;

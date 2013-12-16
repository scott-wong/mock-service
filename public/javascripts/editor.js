// UI
(function() {
    function resize() {
        $('.viewport')
            .height($(window).height() - $('.header').height())
            .css('opacity', 1)
        return resize;
    }
    $(window).on('resize', resize(true));

    var navLinks = ['help', 'about', 'account']
    $.each(navLinks, function(_, className) {
        $('div.header')
            .on('click', 'a.' + className, function() {
                var viewport = $('.viewport')
                if (viewport.hasClass('viewport-' + className)) {
                    viewport.removeClass('viewport-sidebar')
                    $.each(navLinks, function(_, sibling) {
                        viewport.removeClass('viewport-' + sibling)
                    })
                    return
                }
                $.each(navLinks, function(_, sibling) {
                    viewport.removeClass('viewport-' + sibling)
                })
                viewport.addClass('viewport-sidebar')
                    .addClass('viewport-' + className)
            })
    })
    /*$('div.header')
        .on('click', 'a.help', function() {
            var viewport = $('.viewport')
            if (viewport.hasClass('viewport-help')) {
                viewport.removeClass('viewport-sidebar')
                    .removeClass('viewport-help')
                    .removeClass('viewport-about')
                    .removeClass('viewport-account')
                return
            }
            viewport.addClass('viewport-sidebar')
            viewport.removeClass('viewport-about')
            viewport.addClass('viewport-help')
        })
        .on('click', 'a.about', function() {
            var viewport = $('.viewport')
            if (viewport.hasClass('viewport-about')) {
                viewport.removeClass('viewport-sidebar')
                    .removeClass('viewport-help')
                    .removeClass('viewport-about')
                    .removeClass('viewport-account')
                return
            }
            viewport.addClass('viewport-sidebar')
            viewport.removeClass('viewport-help')
            viewport.addClass('viewport-about')
        })*/

    switch (location.hash) {
        case '#help':
            $('a.help').click()
            break
        case '#about':
            $('a.about').click()
            break
        case '#account':
            $('a.account').click()
            break
    }

    // debug
    $('.template').css('background-color', Random.color())
    $('.result').css('background-color', Random.color())
    // $('.sidebar .help').css('background-color', Random.color())
    // $('.sidebar .about').css('background-color', Random.color())
    // $('.sidebar .content').append('<p>' + Random.paragraph() + '</p>')
    // $('.sidebar .content').append('<p>' + Random.paragraph() + '</p>')

})();

// Save, Tidy
(function() {
    // Init
    if (location.pathname.length > 1) {
        var id = location.pathname.slice(1)
        $.getJSON('/mock/item/' + id, function(data) {
            tplEditor.setValue(
                JSON.stringify(data.tpl, null, 2) || ''
            )
            $('.viewport textarea[name=tpl]').val(
                JSON.stringify(data.tpl, null, 2) || ''
            )
        })
    }

    // // Save, Tidy
    $('div.header')
        .on('click', 'a.save', function(event) {
            if (!tplEditor.getValue()) return

            $.ajax({
                url: '/mock/save',
                data: {
                    tpl: tplEditor.getValue()
                },
                success: function(data) {
                    location.pathname = '/' + data.id
                }
            })
        })
        .on('click', 'a.tidy', function(event) {
            stringify(tplEditor.getValue())
        })

    function stringify(tpl) {
        tpl = tpl.replace(/^([\r\n]*)/i, '')
            .replace(/([\r\n]*$)/i, '')
        tpl = new Function('return ' + tpl)
        tpl = tpl() || ''
        tpl = JSON.stringify(tpl, null, 2)
        tplEditor.setValue(tpl)
    }

    function render(tpl) {
        try {
            tpl = tpl.replace(/^([\r\n]*)/i, '')
                .replace(/([\r\n]*$)/i, '')
            tpl = new Function('return ' + tpl)
            tpl = tpl()
        } catch (error) {
            tpl = error.toString()
        }

        var data = Mock.mock(tpl) || ''
        data = JSON.stringify(data, null, 2)
        $('textarea[name=data]').val(data)
        dataEditor.setValue(data)

        var size = (function size(data) {
            var ma = encodeURIComponent(data).match(/%[89ABab]/g);
            return data.length + (ma ? ma.length : 0)
        })(data)
        size = (size / 1024).toFixed(2)
        $('span.badge').text(size + ' kB')
    }

    // Editor
    var tplEditor = CodeMirror
        .fromTextArea($('textarea[name=tpl]').get(0), {
            tabSize: 2,
            tabMode: 'spaces', // or 'shift'
            indentUnit: 2,
            matchBrackets: true,
            lineNumbers: true,
            lineWrapping: true,
            autofocus: true,
            mode: 'javascript',
            theme: 'neat'
        })
    tplEditor.on('change', function(instance) {
        render(instance.getValue())
    })

    var dataEditor = CodeMirror
        .fromTextArea($('textarea[name=data]').get(0), {
            lineNumbers: true,
            autofocus: false,
            mode: 'javascript',
            theme: 'neat'
        })

    // Demo
    $('.viewport .help').on('click', 'a.demo', function(event) {
        var tpl = Mock.heredoc(function() {
            /*!
{
  "boolean": "@BOOLEAN",
  "natural": "@NATURAL",
  "integer": "@INTEGER",
  "float": "@FLOAT",
  "character": "@CHARACTER",
  "string": "@STRING",
  "range": "@RANGE",
  "date": "@DATE",
  "time": "@TIME",
  "datetime": "@DATETIME",

  "image": "@IMAGE",
  "dataImage": "@DATAIMAGE",

  "color": "@COLOR",

  "paragraph": "@PARAGRAPH",
  "sentence": "@SENTENCE",
  "word": "@WORD",
  "title": "@TITLE",

  "first": "@FIRST",
  "last": "@LAST",
  "name": "@NAME",

  "url": "@URL",
  "domain": "@DOMAIN",
  "email": "@EMAIL",
  "ip": "@IP",
  "tld": "@TLD",

  "area": "@AREA",
  "region": "@REGION",
  
  "guid": "@GUID",
  "id": "@ID"
}
             */
        })
        tplEditor.setValue(tpl)
    })

})();

// 
(function() {})();
(function() {
    tinymce.PluginManager.add('countdown_timer_button', function(editor, url) {
        editor.addButton('countdown_timer_button', {
            title: 'Add Countdown Timer',
            icon: 'dashicon dashicons-clock',
            onclick: function() {
                editor.windowManager.open({
                    title: 'Insert Countdown Timer',
                    body: [
                        {
                            type: 'textbox',
                            name: 'date',
                            label: 'End Date (YYYY-MM-DDTHH:MM:SS)',
                            value: ''
                        },
                        {
                            type: 'checkbox',
                            name: 'show_seconds',
                            label: 'Show Seconds',
                            checked: true
                        },
                        {
                            type: 'textbox',
                            name: 'class',
                            label: 'Additional CSS Class',
                            value: ''
                        }
                    ],
                    onsubmit: function(e) {
                        editor.insertContent(
                            '[react_countdown date="' + e.data.date + 
                            '" show_seconds="' + e.data.show_seconds + 
                            '" class="' + e.data.class + '"]'
                        );
                    }
                });
            }
        });
    });
})();
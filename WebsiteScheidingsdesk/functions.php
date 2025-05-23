<?php
/**
 * Countdown Timer - WordPress Child Theme Functions
 *
 * This file contains functions for implementing a React countdown timer as a shortcode
 * that only loads React when the shortcode is used, with cache busting and optimized loading.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue scripts and styles for the countdown timer
 * Only loads on pages where the shortcode is present
 */
function countdown_timer_enqueue_scripts() {
    // Don't load scripts if shortcode isn't present
    global $post;
    if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'react_countdown')) {
        return;
    }

    // Get file modification time for cache busting
    $js_version = file_exists(get_stylesheet_directory() . '/dist/countdown.min.js') 
        ? filemtime(get_stylesheet_directory() . '/dist/countdown.min.js') 
        : '1.0.0';

    // Register React and ReactDOM from WordPress core (optimized loading)
    // WordPress already includes React, so we use that instead of loading our own
    wp_register_script(
        'react',
        includes_url('js/dist/vendor/react.min.js'),
        [],
        false,
        true
    );
    
    wp_register_script(
        'react-dom',
        includes_url('js/dist/vendor/react-dom.min.js'),
        ['react'],
        false,
        true
    );

    // Register and enqueue our countdown timer script
    wp_register_script(
        'countdown-timer',
        get_stylesheet_directory_uri() . '/dist/countdown.min.js',
        ['react', 'react-dom'],
        $js_version,
        true
    );
    
    wp_enqueue_script('countdown-timer');

    // Add inline CSS for the countdown timer
    wp_add_inline_style('theme-style', '
        .countdown-timer {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
        }

        .countdown-timer__content {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .countdown-timer__item {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 60px;
        }

        .countdown-timer__value {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .countdown-timer__label {
            font-size: 0.8rem;
            text-transform: uppercase;
            margin-top: 0.25rem;
        }

        .countdown-timer__complete {
            text-align: center;
            font-weight: bold;
        }

        @media (max-width: 480px) {
            .countdown-timer__content {
                gap: 0.5rem;
            }
            
            .countdown-timer__item {
                min-width: 50px;
            }
            
            .countdown-timer__value {
                font-size: 1.2rem;
            }
            
            .countdown-timer__label {
                font-size: 0.7rem;
            }
        }
    ');
}
add_action('wp_enqueue_scripts', 'countdown_timer_enqueue_scripts');

/**
 * Renders the React countdown timer on the frontend
 *
 * @param array $atts Shortcode attributes
 * @return string HTML markup for the countdown
 */
function countdown_timer_shortcode($atts) {
    // Extract and sanitize attributes with defaults
    $atts = shortcode_atts(array(
        'date' => '', // ISO format date string (e.g., 2023-12-31T23:59:59)
        'show_seconds' => 'true', // Whether to show seconds
        'class' => '', // Additional CSS classes
    ), $atts, 'react_countdown');

    // Validate date
    if (empty($atts['date'])) {
        return '<p class="countdown-error">Error: Please specify a valid date for the countdown timer.</p>';
    }

    // Convert string values to appropriate types for React props
    $show_seconds = filter_var($atts['show_seconds'], FILTER_VALIDATE_BOOLEAN);
    $class = esc_attr($atts['class']);
    $date = esc_attr($atts['date']);

    // Create a unique ID for this countdown instance
    $countdown_id = 'countdown-' . uniqid();

    // Prepare the JavaScript to initialize the React component
    $init_script = "
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof React !== 'undefined' && 
                typeof ReactDOM !== 'undefined' && 
                typeof CountdownTimer !== 'undefined') {

                const container = document.getElementById('" . esc_js($countdown_id) . "');
                if (container) {
                    ReactDOM.render(
                        React.createElement(CountdownTimer, {
                            endDate: '" . esc_js($date) . "',
                            showSeconds: " . ($show_seconds ? 'true' : 'false') . ",
                            className: '" . esc_js($class) . "'
                        }),
                        container
                    );
                }
            }
        });
    ";

    // Add the initialization script inline
    wp_add_inline_script('countdown-timer', $init_script);

    // Return the container div where React will mount the component
    return '<div id="' . esc_attr($countdown_id) . '" class="react-countdown-container"></div>';
}
add_shortcode('react_countdown', 'countdown_timer_shortcode');

/**
 * Add shortcode to Classic Editor's TinyMCE dropdown
 */
function countdown_timer_mce_button() {
    if (!current_user_can('edit_posts') && !current_user_can('edit_pages')) {
        return;
    }

    // Add only in Rich Editor mode
    if (get_user_option('rich_editing') !== 'true') {
        return;
    }

    // Add the shortcode button to TinyMCE
    add_filter('mce_external_plugins', 'countdown_timer_add_tinymce_plugin');
    add_filter('mce_buttons', 'countdown_timer_register_button');
}
add_action('admin_head', 'countdown_timer_mce_button');

/**
 * Register new button in the editor
 */
function countdown_timer_register_button($buttons) {
    array_push($buttons, 'countdown_timer_button');
    return $buttons;
}

/**
 * Declare script for new button
 */
function countdown_timer_add_tinymce_plugin($plugin_array) {
    $plugin_array['countdown_timer_button'] = get_stylesheet_directory_uri() . '/js/countdown-editor.js';
    return $plugin_array;
}

/**
 * Enqueue admin scripts for the countdown editor button
 */
function countdown_timer_admin_scripts() {
    // Only load on the editor
    if (!is_admin()) {
        return;
    }

    // Get file modification time for cache busting
    $js_version = file_exists(get_stylesheet_directory() . '/js/countdown-editor.js') 
        ? filemtime(get_stylesheet_directory() . '/js/countdown-editor.js') 
        : '1.0.0';

    wp_enqueue_script(
        'countdown-editor',
        get_stylesheet_directory_uri() . '/js/countdown-editor.js',
        ['jquery'],
        $js_version,
        true
    );
}
add_action('admin_enqueue_scripts', 'countdown_timer_admin_scripts');

/**
 * Add a Block Editor block for the countdown (Gutenberg)
 */
function countdown_timer_block_editor() {
    // Check if block editor is available
    if (!function_exists('register_block_type')) {
        return;
    }

    // Register the script for the block editor
    wp_register_script(
        'countdown-timer-block',
        get_stylesheet_directory_uri() . '/js/countdown-block.js',
        ['wp-blocks', 'wp-element', 'wp-components', 'wp-editor'],
        filemtime(get_stylesheet_directory() . '/js/countdown-block.js'),
        true
    );

    // Register the block type
    register_block_type('countdown-timer/block', [
        'editor_script' => 'countdown-timer-block',
        'render_callback' => 'countdown_timer_shortcode',
        'attributes' => [
            'date' => [
                'type' => 'string',
                'default' => '',
            ],
            'showSeconds' => [
                'type' => 'boolean',
                'default' => true,
            ],
            'className' => [
                'type' => 'string',
                'default' => '',
            ],
        ],
    ]);
}
add_action('init', 'countdown_timer_block_editor');
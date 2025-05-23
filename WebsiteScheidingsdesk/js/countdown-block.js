const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.editor;
const { PanelBody, TextControl, ToggleControl } = wp.components;
const { Fragment } = wp.element;

registerBlockType('countdown-timer/block', {
    title: 'Countdown Timer',
    icon: 'clock',
    category: 'widgets',
    
    attributes: {
        date: {
            type: 'string',
            default: '',
        },
        showSeconds: {
            type: 'boolean',
            default: true,
        },
        className: {
            type: 'string',
            default: '',
        },
    },
    
    edit: function(props) {
        const { attributes, setAttributes } = props;
        
        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Countdown Settings">
                        <TextControl
                            label="End Date (YYYY-MM-DDTHH:MM:SS)"
                            value={attributes.date}
                            onChange={(value) => setAttributes({ date: value })}
                        />
                        <ToggleControl
                            label="Show Seconds"
                            checked={attributes.showSeconds}
                            onChange={(value) => setAttributes({ showSeconds: value })}
                        />
                        <TextControl
                            label="Additional CSS Class"
                            value={attributes.className}
                            onChange={(value) => setAttributes({ className: value })}
                        />
                    </PanelBody>
                </InspectorControls>
                
                <div className="countdown-editor-preview">
                    <p><strong>Countdown Timer</strong></p>
                    <p>Target Date: {attributes.date || 'Please set a date'}</p>
                    <p>Show Seconds: {attributes.showSeconds ? 'Yes' : 'No'}</p>
                    {attributes.className && <p>Additional Class: {attributes.className}</p>}
                </div>
            </Fragment>
        );
    },
    
    save: function() {
        // Dynamic block that renders on the server side
        return null;
    },
});
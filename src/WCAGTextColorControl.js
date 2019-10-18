/* global jQuery, React, ReactDOM, Color */
import WCAGTextColorForm from './WCAGTextColorForm';

/**
 * WCAGTextColorControl.
 *
 * @class
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
const WCAGTextColorControl = wp.customize.Control.extend( {

	/**
	 * Initialize.
	 *
	 * @param {string} id - Control ID.
	 * @param {Object} params - Control params.
	 */
	initialize( id, params ) {
		const control = this;

		// Bind functions to this control context for passing as React props.
		control.setNotificationContainer = control.setNotificationContainer.bind( control );

		wp.customize.Control.prototype.initialize.call( control, id, params );

		// The following should be eliminated with <https://core.trac.wordpress.org/ticket/31334>.
		function onRemoved( removedControl ) {
			if ( control === removedControl ) {
				control.destroy();
				control.container.remove();
				wp.customize.control.unbind( 'removed', onRemoved );
			}
		}
		wp.customize.control.bind( 'removed', onRemoved );
	},

	/**
	 * Set notification container and render.
	 *
	 * This is called when the React component is mounted.
	 *
	 * @param {Element} element - Notification container.
	 * @return {void}
	 */
	setNotificationContainer: function setNotificationContainer( element ) {
		const control = this;
		control.notifications.container = jQuery( element );
		control.notifications.render();
	},

	/**
	 * Render the control into the DOM.
	 *
	 * This is called from the Control#embed() method in the parent class.
	 *
	 * @return {void}
	 */
	renderContent: function renderContent() {
		const control = this;
		const value = control.setting.get();

		ReactDOM.render(
			<WCAGTextColorForm
				{ ...control.params }
				value={ value }
				setNotificationContainer={ control.setNotificationContainer }
				customizerSetting={ control.setting }
				control={ control }
				backgroundColor={ control.getBackgroundColor() }
				autoColor={ control.getAutoColor() }
			/>,
			control.container[ 0 ]
		);

		if ( false !== control.params.choices.allowCollapse ) {
			control.container.addClass( 'allowCollapse colorPickerIsCollapsed' );
		}
	},

	/**
	 * After control has been first rendered, start re-rendering when setting changes.
	 *
	 * React is able to be used here instead of the wp.customize.Element abstraction.
	 *
	 * @return {void}
	 */
	ready: function ready() {
		const control = this;

		// Re-render control when setting changes.
		control.setting.bind( () => {
			control.renderContent();
		} );

		// Watch for changes to the background color.
		control.watchSetting( control.params.choices.backgroundColor, 'backgroundColor' );
	},

	/**
	 * Get the background color.
	 *
	 * @return {string} - HEX color.
	 */
	getBackgroundColor() {
		const control = this;

		if ( control.backgroundColor ) {
			return control.backgroundColor;
		}

		if (
			0 === control.params.choices.backgroundColor.indexOf( '#' ) ||
			0 === control.params.choices.backgroundColor.indexOf( 'rgb(' ) ||
			0 === control.params.choices.backgroundColor.indexOf( 'rgba(' ) ||
			0 === control.params.choices.backgroundColor.indexOf( 'hsl(' ) ||
			0 === control.params.choices.backgroundColor.indexOf( 'hsla(' )
		) {
			control.backgroundColor = control.params.choices.backgroundColor;
			return control.backgroundColor;
		}

		control.backgroundColor = wp.customize( control.params.choices.backgroundColor ).get();
		return control.backgroundColor;
	},

	/**
	 * Watch defined controls and re-trigger results calculations when there's a change.
	 *
	 * @param {string} settingToWatch - The setting we want to watch or a hardcoded color.
	 * @return {void}
	 */
	watchSetting( settingToWatch ) {
		const control = this;
		const debounce = require( 'lodash.debounce' );
		wp.customize( settingToWatch, function( setting ) {
			setting.bind( debounce( function() {
				control.backgroundColor = false;

				const val = control.getAutoColor();
				const noChange = val === control.setting.get();

				control.setting.set( val );

				if ( noChange ) {
					control.renderContent();
				}
			}, 100 ) );
		} );

		if ( -1 < settingToWatch.indexOf( '[' ) ) {
			wp.customize( settingToWatch.split( '[' )[ 0 ], function( setting ) {
				setting.bind( debounce( function() {
					control.backgroundColor = false;

					const val = control.getAutoColor();
					const noChange = val === control.setting.get();

					control.setting.set( val );

					if ( noChange ) {
						control.renderContent();
					}
				}, 100 ) );
			} );
		}
	},

	/**
	 * Get the auto-color.
	 *
	 * @return {string} - Returns the auto-color as a hex value.
	 */
	getAutoColor() {
		return Color( this.getBackgroundColor() ).getMaxContrastColor().toCSS();
	},

	/**
	 * Handle removal/de-registration of the control.
	 *
	 * This is essentially the inverse of the Control#embed() method.
	 *
	 * @see https://core.trac.wordpress.org/ticket/31334
	 * @return {void}
	 */
	destroy: function destroy() {
		const control = this;

		// Garbage collection: undo mounting that was done in the embed/renderContent method.
		ReactDOM.unmountComponentAtNode( control.container[ 0 ] );

		// Call destroy method in parent if it exists (as of #31334).
		if ( wp.customize.Control.prototype.destroy ) {
			wp.customize.Control.prototype.destroy.call( control );
		}
	}
} );

export default WCAGTextColorControl;

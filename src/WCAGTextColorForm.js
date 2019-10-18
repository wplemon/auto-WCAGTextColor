/* globals React */
/* eslint jsx-a11y/label-has-for: off */
import reactCSS from 'reactcss';
import WCAGTextColorIndicator from './WCAGTextColorIndicator';

const WCAGTextLinkColorForm = ( props ) => {
	// Styles.
	const styles = reactCSS( {
		default: {
			controlHead: {},
			tabsWrapper: {}
		}
	} );

	return (
		<div>
			<div style={ styles.controlHead }>
				<label id={ 'label-' + props.customizerSetting.id } className="customize-control-title">{ props.label }</label>
				<span className="description customize-control-description" dangerouslySetInnerHTML={ { __html: props.description } }></span>
				<div className="customize-control-notifications-container" ref={ props.setNotificationContainer }></div>
			</div>

			<div style={ styles.tabsWrapper }>
				<WCAGTextColorIndicator { ...props } />
			</div>
		</div>
	);
};

export default WCAGTextLinkColorForm;

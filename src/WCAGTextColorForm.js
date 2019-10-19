/* globals React */
/* eslint jsx-a11y/label-has-for: off */
import reactCSS from 'reactcss';
import WCAGTextColorIndicator from './WCAGTextColorIndicator';

const WCAGTextLinkColorForm = ( props ) => {
	// Styles.
	const styles = reactCSS( {
		default: {
			controlHead: {},
			inputWrapper: {},
			wrapper: {
				display: 'hidden' === props.appearance ? 'none' : 'block'
			}
		}
	} );

	let inputWrapper = <div style={ styles.inputWrapper }>
		<WCAGTextColorIndicator { ...props } />
	</div>;

	if ( 'details' === props.appearance ) {
		return <div>
			<details>
				<summary>{ props.label }</summary>
				<span className="description customize-control-description" dangerouslySetInnerHTML={ { __html: props.description } }></span>
				{ inputWrapper }
			</details>
			<div className="customize-control-notifications-container" ref={ props.setNotificationContainer }></div>
		</div>;
	}

	if ( 'default' === props.appearance ) {
		return (
			<div styles={ styles.wrapper } >
				<div style={ styles.controlHead }>
					<label id={ 'label-' + props.customizerSetting.id } className="customize-control-title">{ props.label }</label>
					<span className="description customize-control-description" dangerouslySetInnerHTML={ { __html: props.description } }></span>
					<div className="customize-control-notifications-container" ref={ props.setNotificationContainer }></div>
				</div>
				{ inputWrapper }
			</div>
		);
	}

	return '';
};

export default WCAGTextLinkColorForm;

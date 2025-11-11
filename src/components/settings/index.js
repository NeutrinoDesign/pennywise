import React from 'react';
import debounce from 'lodash.debounce';

import './style.scss';

class Settings extends React.Component {
  state = {
    opacity: 100
  };

  componentDidMount() {
    // Fetch initial opacity via secure bridge
    window.pennywise.getOpacity().then((value) => {
      this.setState({ opacity: value });
    });
    this.unsubscribeOpacity = window.pennywise.on('opacity.sync', this.onOpacitySync);
  }

  componentWillUnmount() {
    if (this.unsubscribeOpacity) this.unsubscribeOpacity();
  }

  // Debounce the setter so to avoid bombarding
  // electron with the opacity change requests
  setOpacity = debounce((opacity) => {
    window.pennywise.setOpacity(opacity);
  }, 400);

  onOpacitySync = (opacity) => {
    this.setState({ opacity });
  };

  onOpacityChange = (e) => {
    this.setState({
      opacity: e.target.value
    });

    this.setOpacity(e.target.value);
  };

  render() {
    return (
      <div className='settings-wrap'>
        <div className="setting-controls">
          <div className="setting-control opacity-picker">
            <label htmlFor="opacity-picker"><i className="fa fa-lightbulb-o"/></label>
            <input type="range" onChange={ this.onOpacityChange } value={ this.state.opacity } min="20" max="100" className="slider" id="opacity-picker"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;

import React from 'react';

import EmptyPage from './components/empty-page';
import WebPage from './components/web-page';
import { prepareUrl } from './utils/helpers';

class Browser extends React.Component {
  state = {
    url: '',
    showNav: true,
    embedVideosEnabled: true
  };

  onUrl = (url) => {
    this.setState({
      url: prepareUrl(url, this.state.embedVideosEnabled),
    });
  };

  onembedVideosSet = (embedVideosEnabled) => {
    this.setState({ embedVideosEnabled });
  };

  onUrlRequested = (url) => {
    this.onUrl(url)
  };

  componentDidMount() {
    // Subscribe to events via secure preload bridge
    this.unsubscribeEmbed = window.pennywise.on('embedVideos.set', this.onembedVideosSet);
    this.unsubscribeUrlReq = window.pennywise.on('url.requested', this.onUrlRequested);

    // Initialize from argv
    window.pennywise.getArgv().then((args) => {
      const hasHideNav = args.some((a) => a === '--hidenav' || a === 'hidenav' || a === '--hide-nav');
      const urlArgEntry = args.find((a) => a.startsWith('--url='));
      const urlValue = urlArgEntry ? urlArgEntry.split('=').slice(1).join('=') : '';
      this.setState({
        url: urlValue ? prepareUrl(urlValue) : '',
        showNav: !hasHideNav
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeEmbed) this.unsubscribeEmbed();
    if (this.unsubscribeUrlReq) this.unsubscribeUrlReq();
  }

  render() {
    return (
      <div className='browser-wrap'>
        {
          this.state.url
            ? <WebPage url={ this.state.url } onUrl={ this.onUrl } showNav={this.state.showNav}/>
            : <EmptyPage onUrl={ this.onUrl }/>
        }
      </div>
    );
  }
}

export default Browser;

import React from 'react';
import {render} from 'react-dom';
import YouTubePlayer from 'youtube-player';

let stateNames = {
  '-1': 'unstarted',
  0: 'ended',
  1: 'playing',
  2: 'paused',
  3: 'buffering',
  5: 'cued'
}

class YouTube extends React.Component {


  constructor(props) {
    super(props)
  }

  static defaultProps = {
    width: '100%',
    height: '100%',
    playbackState: 'unstarted',
    configuration: {},
    onEnd: () => {},
    onPlay: () => {},
    onPause: () => {},
    onBuffer: () => {},
    onError: () => {}
  };

  componentDidMount () {
    this.player = YouTubePlayer(this.refs.player, {
      playerVars: this.props.configuration
    });
    this.bindEvent()
    this.player.cuePlaylist({list: this.props.playlistId, listType: 'playlist', index:0})
  }

  componentWillReceiveProps (nextProps) {
    this.diffState(this.props, nextProps);
  }

  shouldComponentUpdate () {
    return false;
  }

  diffState(prevProps, nextProps) {
    if (prevProps.videoId !== nextProps.videoId && nextProps.videoId) {
      this.player.loadVideoById(nextProps.videoId);
    }
  }

  bindEvent() {
    this.player.on('stateChange', (event) => {
      let realPlaybackState = stateNames[event.data];

      if (realPlaybackState === 'ended') {
        this.props.onEnd(event);
      } else if (realPlaybackState === 'playing') {
        this.props.onPlay(event);
        this.player.getVideoEmbedCode().then(function(code){
          console.log(code)
        })
      } else if (realPlaybackState === 'paused') {
        this.props.onPause(event);
      } else if (realPlaybackState === 'buffering') {
        this.props.onBuffer(event);
      } else if (realPlaybackState === 'cued') {
        this.player.setShuffle(true).then(() => {
          this.player.nextVideo()
          this.player.playVideo()
          this.player.getPlaylist().then(function(i){
            console.log(i)
          })
        })
        console.log('getPlaylist')
        //this.player.playVideo()
      }
    });

    this.player.on('error', (event) => {
      this.props.onError(event);
      this.player.nextVideo()
    });
  };

  render () {
    let style;

    style = {
      width: '100%',
      height: '100%',
      display: 'block'
    };

    return <div ref='viewport' style={style}>
      <div ref='player' style={style}></div>
    </div>;
  }

}

export default YouTube;


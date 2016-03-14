import React from 'react';
import {render} from 'react-dom';
import catalog from './catalog';
import YouTube from './youtube';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.setupCast()
    this.setupPlaylist()
    this.state = {
      playlistId: 'PLIywbVhGXJaRhnpfPG_kv9KXDQNbNK1a5',
      videoId: catalog[0],
      videoIdx: 0,
    }
  }

  setupPlaylist() {
    let counter = catalog.length;
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = catalog[counter];
        catalog[counter] = catalog[index];
        catalog[index] = temp;
    }
  }

  setupCast() {
    try {
      window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
      window.castReceiverManager.start();
    } catch(e) {
      console.log(e)
    }
  }

  render () {
    let item = catalog[0]
    return (
      <div className='main' style={{backgroundColor: item.backgroundColor}}>
        <div id='overlay'><img src='logo.png' width='300' /></div>
        <YouTube
          playlistId={this.state.playlistId}
          configuration={
            {
              showinfo: 1,
              controls: 0,
              autoplay: 0,
            }
          }
          />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  NativeModules,
  NativeAppEventEmitter,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image,
  ListView,
  View,
} from 'react-native';

let headerImg = require('./assets/80sBlasterHeader.png')

class EightiesBlaster extends Component {
  constructor(props) {
    super(props)
    console.log("StartingScan")
    this.subscribe()
    NativeModules.Chromecaster.startScan()
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['']),
    };
  }

  subscribe() {
    console.log("Subscribe to DeviceListChanged")
    var subscription = NativeAppEventEmitter.addListener(
      'DeviceListChanged',
      (list) => {
        console.log('DeviceListChanged', list)
        this.setState({dataSource: this.state.dataSource.cloneWithRows(list.devices)})
      }
    );
  }

  connectAndPlay(name) {
    NativeModules.Chromecaster.connectToDevice(name)
  }

  renderRow(rowData) {
    return (
      <TouchableHighlight
      onPress={this.connectAndPlay.bind(rowData)}>
        <Text
        style={{color:'#FFFFFF'}}>
        {rowData}
        </Text>
      </TouchableHighlight>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={headerImg}/>
        <Text style={styles.welcome}>
          Welcome to 80's Blaster
        </Text>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('EightiesBlaster', () => EightiesBlaster);

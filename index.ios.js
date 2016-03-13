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
  Text,
  ListView,
  View,
} from 'react-native';

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

  renderRow(rowData) {
    return (
      <Text
      onPress={()=>{
        console.log(rowData)
        NativeModules.Chromecaster.connectToDevice(rowData)
      }} >
      {rowData}
      </Text>
    )
  }

  render() {
    return (
      <View style={styles.container}>
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
    backgroundColor: '#F5FCFF',
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

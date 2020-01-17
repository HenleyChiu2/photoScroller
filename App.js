import React, { Component } from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
  Button,
  Random,
} from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

export default class PhotoScroller extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
    this._onPressButton = this._onPressButton.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    return fetch('https://jsonplaceholder.typicode.com/photos?albumId=1')
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isLoading: false,
            dataSource: responseJson,
          },
          function() {}
        );
      })

      .catch(error => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          data={this.state.dataSource}
          renderItem={({ item }) => <PhotoComponent item={item} />}
          keyExtractor={({ id }, index) => id}
          //fixes re-rendering issues
          style={{ height: 200 }}
        />
        <Separator />
        <Button title="Shuffle" onPress={this._onPressButton} />
      </View>
    );
  }

  _onPressButton() {
    this.handleClick(this.state.dataSource);
    this.setState({ isLoading: false });
  }

  handleClick(array) {
    if (array.length <= 1) return array;

    let index = Math.floor(Math.random() * array.length);
    let removed = array[index];
    array.splice(index, 1);

    let result = this.handleClick(array);
    result.push(removed);

    return result;
  }
}

function Separator() {
  return <View style={styles.separator} />;
}

class PhotoComponent extends Component {
  render() {
    return (
      <View style={styles.photoWrapper}>
        <ImageBackground
          source={{ uri: this.props.item.url }}
          style={styles.photoStyle}>
          <Text style={styles.textStyle}>{this.props.item.title}</Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  photoWrapper: {
    //shadow dimensions
    margin: 15,
    width: 300,
    height: 300,

    //rounded corners
    borderRadius: 15,

    //shadow
    shadowOffset: { width: 10, height: 10 },
    shadowRadius: 3,
    shadowOpacity: 1,
    elevation: 10,
  },

  photoStyle: {
    overflow: 'hidden',

    //image
    paddingTop: '35%',
    margin: 8,
    width: 300,
    height: 300,

    //rounded corners
    borderRadius: 15,

    //border
    borderWidth: 2,

    //shadow
    shadowOffset: { width: 10, height: 10 },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 12,
  },

  textStyle: {
    textAlignVertical: 'center',
    textAlign: 'center',
    transform: [{ rotate: '45deg', textAnchor: 'center', translateY: '-100%' }],
  },

  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

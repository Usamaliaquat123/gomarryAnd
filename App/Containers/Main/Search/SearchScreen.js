import React, {Component} from 'react';
import {
  BackHandler,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-root-toast';

import {CheckBox, Card, Icon} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Api from '../../../Services/Api';
import RNPickerSelect from 'react-native-picker-select';

import UserCard from '../../../Components/UserCard';
import CommonHeader from '../../../Components/CommonHeader';
import MoreOptionItem from '../../../Components/MoreOptionItem';
import {age_range, distance_range} from '../../../Components/ConstantList';
// Styles
import Styles from './SearchScreenStyle';
import SampleUserCard from '../../../Components/SampleUserCard';
import {Fonts, Colors} from '../../../Themes';

export default class SearchScreen extends Component {
  static navigationOptions = {
    title: 'Search',
    drawerIcon: ({tintColor}) => (
      <Icon
        name="magnifier"
        type="simple-line-icon"
        style={[{color: tintColor}]}
      />
    ),
  };

  constructor(props) {
    super(props);
    const serverData = [];
    this.attributes = global.attributes;
    this.state = {
      loading: true,
      serverData: [],
      fetching_from_server: false,
      itemslimit: false,

      dataset: null,
      datasetState: null,
      moreOption: false,

      distance: null,
      age_from: null,
      age_to: null,
      trusted_member: false,
      withPhotos: false,
      isPermium: false,
      withVideos: false,
      selectedNationality: [],
      selectedLanguage: [],
      selectedEthnic_origin: [],
      selectedSecondLanguage: [],
      selectedPersonality: [],
      selectedPersonalWealth: [],
      selectedMarital: [],
      selectedReligious: [],
      selectedChildren: [],
      selectedSiblings: [],
      selectedLiving: [],
      selectedMove: [],
      selectedDiet: [],
      selectedSmoking: [],
      selectedEducation: [],
      selectedProfession: [],
      selectedAmbition: [],
      selectedEye: [],
      selectedHair: [],
      selectedBody: [],
      selectedHeight: [],
    };
    this.offset = 1;
  }

  componentWillMount() {
    this.setupImpagination();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
  }
  loadMoreData = () => {
    this.setState({fetching_from_server: true}, () => this.setupImpagination());
  };
  renderFooter() {
    return (
      <View style={Styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.loadMoreData}
          style={Styles.loadMoreBtn}>
          <Text style={Styles.btnText}>Load More</Text>
          {this.state.fetching_from_server ? (
            <ActivityIndicator color="white" style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
  filterImpagination() {
    this.offset = 1;
    this.setState({
      loading: true,
      serverData: [],
    });

    this.setupImpagination();
  }

  setupImpagination() {
    let _this = this;
    let {
      distance,
      age_from,
      age_to,
      withPhotos,
      trusted_member,
      isPermium,
      withVideos,
      selectedEthnic_origin,
      selectedNationality,
      selectedLanguage,
      selectedSecondLanguage,
      selectedPersonality,
      selectedPersonalWealth,
      selectedMarital,
      selectedReligious,
      selectedChildren,
      selectedSiblings,
      selectedLiving,
      selectedMove,
      selectedDiet,
      selectedSmoking,
      selectedEducation,
      selectedProfession,
      selectedAmbition,
      selectedEye,
      selectedHair,
      selectedBody,
      selectedHeight,
    } = _this.state;

    let parameters = {
      ethnic_origin: selectedEthnic_origin.length
        ? selectedEthnic_origin.join(',')
        : null,
      nationality: selectedNationality.length
        ? selectedNationality.join(',')
        : null,
      language: selectedLanguage.length ? selectedLanguage.join(',') : null,
      second_language: selectedSecondLanguage.length
        ? selectedSecondLanguage.join(',')
        : null,
      personality: selectedPersonality.length
        ? selectedPersonality.join(',')
        : null,
      personal_wealth: selectedPersonalWealth.length
        ? selectedPersonalWealth.join(',')
        : null,
      marital_status: selectedMarital.length ? selectedMarital.join(',') : null,
      religious_status: selectedReligious.length
        ? selectedReligious.join(',')
        : null,
      children: selectedChildren.length ? selectedChildren.join(',') : null,
      siblings: selectedSiblings.length ? selectedSiblings.join(',') : null,
      living_status: selectedLiving.length ? selectedLiving.join(',') : null,
      move: selectedMove.length ? selectedMove.join(',') : null,
      diet: selectedDiet.length ? selectedDiet.join(',') : null,
      smoking: selectedSmoking.length ? selectedSmoking.join(',') : null,
      education: selectedEducation.length ? selectedEducation.join(',') : null,
      profession: selectedProfession.length
        ? selectedProfession.join(',')
        : null,
      ambition: selectedAmbition.length ? selectedAmbition.join(',') : null,
      eye_colour: selectedEye.length ? selectedEye.join(',') : null,
      hair_colour: selectedHair.length ? selectedHair.join(',') : null,
      body_type: selectedBody.length ? selectedBody.join(',') : null,
      height: selectedHeight.length ? selectedHeight.join(',') : null,
      distance,
      age_from,
      age_to,
      photos: withPhotos ? 1 : 0,
      trusted_member: trusted_member ? 1 : 0,
      permium: isPermium ? 1 : 0,
      videos: withVideos ? 1 : 0,
    };

    for (let elements in parameters) {
      if (parameters[elements] == null) delete parameters[elements];
    }

    Api.search(parameters, this.offset, 20)
      .then(data => {
        this.offset = this.offset + 1;
        if (data.users.length != 0 && !(data.pagination.totalItems <= 20)) {
          this.state.serverData.push(...data.users);
          this.setState({
            loading: false,
            itemslimit: false,
            fetching_from_server: false,
          });
        } else if (data.pagination.totalItems <= 20) {
          console.log(data.pagination.totalItems);

          this.state.serverData.push(...data.users);
          console.log(this.state.serverData);
          this.setState({
            loading: false,
            fetching_from_server: false,
            itemslimit: true,
          });
        } else {
          this.setState({
            itemslimit: true,
          });
        }
      })
      .catch(error => {
        Toast.show(error, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      });
  }

  render() {
    const {moreOption} = this.state;
    return (
      <React.Fragment>
        <CommonHeader title={'Search'} />
        <ScrollView>
          <Card containerStyle={{borderRadius: 8}}>
            <Text
              style={{
                fontSize: 16,
                margin: 5,
                fontFamily: Fonts.app_font,
                color: Colors.mainAppColor,
              }}>
              Distance
            </Text>
            <RNPickerSelect
              placeholder={{label: '250 KM', value: '250'}}
              style={pickerSelectStyles}
              onValueChange={value => this.setState({distance: value})}
              items={distance_range}
            />
            <Text
              style={{
                fontSize: 16,
                margin: 5,
                fontFamily: Fonts.app_font,
                color: Colors.mainAppColor,
              }}>
              Age Range
            </Text>

            <View style={Styles.rowpicker}>
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{label: '18', value: '18'}}
                onValueChange={value => this.setState({age_from: value})}
                items={age_range}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Fonts.app_font,
                  color: Colors.mainAppColor,
                }}>
                To
              </Text>
              <RNPickerSelect
                placeholder={{label: '30', value: '30'}}
                style={pickerSelectStyles}
                onValueChange={value => this.setState({age_to: value})}
                items={age_range}
              />
            </View>
            <MoreOptionItem
              name="ethnic_origin"
              title="Ethnic Origin"
              selectedItems={this.state.selectedEthnic_origin}
              onSelectionsChange={selected => {
                this.setState({selectedEthnic_origin: selected});
              }}
            />
            <MoreOptionItem
              name="nationality"
              title="Nationality"
              selectedItems={this.state.selectedNationality}
              onSelectionsChange={selected => {
                this.setState({selectedNationality: selected});
              }}
            />
            <MoreOptionItem
              name="language"
              title="Language"
              selectedItems={this.state.selectedLanguage}
              onSelectionsChange={selected => {
                this.setState({selectedLanguage: selected});
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignContent: 'flex-end',
                margin: 10,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.app_font,
                  fontSize: 16,
                }}
                onPress={() => this.setState({moreOption: !moreOption})}>
                More Option
              </Text>
              <Icon
                onPress={() => this.setState({moreOption: !moreOption})}
                name="arrow-down"
                type="simple-line-icon"
                size={12}
                iconStyle={{margin: 5}}
              />
            </View>

            {moreOption == true && (
              <View>
                <MoreOptionItem
                  name="second_language"
                  title="Second Language"
                  selectedItems={this.state.selectedSecondLanguage}
                  onSelectionsChange={selected => {
                    this.setState({selectedSecondLanguage: selected});
                  }}
                />
                <MoreOptionItem
                  name="personality"
                  title="Personality Style"
                  selectedItems={this.state.selectedPersonality}
                  onSelectionsChange={selected => {
                    this.setState({selectedPersonality: selected});
                  }}
                />
                <MoreOptionItem
                  name="personal_wealth"
                  title="Personal Wealth"
                  selectedItems={this.state.selectedPersonalWealth}
                  onSelectionsChange={selected => {
                    this.setState({selectedPersonalWealth: selected});
                  }}
                />
                <MoreOptionItem
                  name="marital_status"
                  title="Marital Status"
                  selectedItems={this.state.selectedMarital}
                  onSelectionsChange={selected => {
                    this.setState({selectedMarital: selected});
                  }}
                />
                <MoreOptionItem
                  name="religious_status"
                  title="Religious Affiliation"
                  selectedItems={this.state.selectedReligious}
                  onSelectionsChange={selected => {
                    this.setState({selectedReligious: selected});
                  }}
                />
                <MoreOptionItem
                  name="children"
                  title="Children"
                  selectedItems={this.state.selectedChildren}
                  onSelectionsChange={selected => {
                    this.setState({selectedChildren: selected});
                  }}
                />
                <MoreOptionItem
                  name="siblings"
                  title="Siblings"
                  selectedItems={this.state.selectedSiblings}
                  onSelectionsChange={selected => {
                    this.setState({selectedSiblings: selected});
                  }}
                />

                <MoreOptionItem
                  name="living_status"
                  title="Living Status"
                  selectedItems={this.state.selectedLiving}
                  onSelectionsChange={selected => {
                    this.setState({selectedLiving: selected});
                  }}
                />
                <MoreOptionItem
                  name="move"
                  title="Willing to Move"
                  selectedItems={this.state.selectedMove}
                  onSelectionsChange={selected => {
                    this.setState({selectedMove: selected});
                  }}
                />
                <MoreOptionItem
                  name="diet"
                  title="Diet"
                  selectedItems={this.state.selectedDiet}
                  onSelectionsChange={selected => {
                    this.setState({selectedDiet: selected});
                  }}
                />
                <MoreOptionItem
                  name="smoking"
                  title="Smoking"
                  selectedItems={this.state.selectedSmoking}
                  onSelectionsChange={selected => {
                    this.setState({selectedSmoking: selected});
                  }}
                />
                <MoreOptionItem
                  name="education"
                  title="Education"
                  selectedItems={this.state.selectedEducation}
                  onSelectionsChange={selected => {
                    this.setState({selectedEducation: selected});
                  }}
                />
                <MoreOptionItem
                  name="profession"
                  title="Profession"
                  selectedItems={this.state.selectedProfession}
                  onSelectionsChange={selected => {
                    this.setState({selectedProfession: selected});
                  }}
                />
                <MoreOptionItem
                  name="ambition"
                  title="Ambition"
                  selectedItems={this.state.selectedAmbition}
                  onSelectionsChange={selected => {
                    this.setState({selectedAmbition: selected});
                  }}
                />
                <MoreOptionItem
                  name="eye_colour"
                  title="Eye Colour"
                  selectedItems={this.state.selectedEye}
                  onSelectionsChange={selected => {
                    this.setState({selectedEye: selected});
                  }}
                />
                <MoreOptionItem
                  name="hair_colour"
                  title="Hair Colour"
                  selectedItems={this.state.selectedHair}
                  onSelectionsChange={selected => {
                    this.setState({selectedHair: selected});
                  }}
                />
                <MoreOptionItem
                  name="body_type"
                  title="Body Type"
                  selectedItems={this.state.selectedBody}
                  onSelectionsChange={selected => {
                    this.setState({selectedBody: selected});
                  }}
                />
                <MoreOptionItem
                  name="height"
                  title="Height"
                  selectedItems={this.state.selectedHeight}
                  onSelectionsChange={selected => {
                    this.setState({selectedHeight: selected});
                  }}
                />
              </View>
            )}
            <View style={Styles.rowcheckboxes}>
              <CheckBox
                containerStyle={Styles.checkboxes}
                title="Trusted Member "
                textStyle={Styles.checkboxText}
                checked={this.state.trusted_member}
                onPress={() =>
                  this.setState({
                    trusted_member: !this.state.trusted_member,
                  })
                }
              />
              <CheckBox
                containerStyle={Styles.checkboxes}
                textStyle={Styles.checkboxText}
                title="With Photos"
                checked={this.state.withPhotos}
                onPress={() =>
                  this.setState({
                    withPhotos: !this.state.withPhotos,
                  })
                }
              />
            </View>
            <View style={Styles.rowcheckboxes}>
              <CheckBox
                containerStyle={Styles.checkboxes}
                title="Permium"
                textStyle={Styles.checkboxText}
                checked={this.state.isPermium}
                onPress={() =>
                  this.setState({
                    isPermium: !this.state.isPermium,
                  })
                }
              />
              <CheckBox
                containerStyle={Styles.checkboxes}
                title="With Videos"
                textStyle={Styles.checkboxText}
                checked={this.state.withVideos}
                onPress={() =>
                  this.setState({
                    withVideos: !this.state.withVideos,
                  })
                }
              />
            </View>
            <TouchableOpacity
              style={Styles.searchButton}
              onPress={() => this.filterImpagination()}>
              <LinearGradient
                colors={['#FC3838', '#F52B43', '#ED0D51']}
                start={{x: 0.7, y: 1.2}}
                end={{x: 0.0, y: 0.7}}
                style={{
                  height: 48,
                  width: 270,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 270,
                  borderRadius: 3,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Filter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Card>
          {this.state.loading && <SampleUserCard />}
          {!this.state.loading && (
            <FlatList
              style={{flex: 0}}
              removeClippedSubviews={true}
              keyExtractor={(item, index) => item.user_id}
              data={this.state.serverData}
              renderItem={({item, index}) => (
                <UserCard key={index} user={item} />
              )}
              ListFooterComponent={
                !this.state.itemslimit ? this.renderFooter.bind(this) : null
              }
            />
          )}
        </ScrollView>
      </React.Fragment>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

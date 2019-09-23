import React, { Component } from "react";
import {
  ToastAndroid,
  Alert,
  Text,
  View,
  TextInput,
  ScrollView,
  FlatList
} from "react-native";
import { CheckBox, ButtonGroup, Card } from "react-native-elements";
import Api from "../../../Services/Api";
import RadioForm from "react-native-simple-radio-button";
import ActivityOverlay from "../../../Components/ActivityOverlay";
import CommonHeaderBack from "../../../Components/CommonHeaderBack";
// Styles
import styles from "./SurveyScreenStyle";
import { Colors } from "../../../Themes";

const rateAnswerslist = [
  { label: "Not important", value: 1 },
  { label: "Important", value: 3 },
  { label: "Very important", value: 5 },
  { label: " It's a deal breaker!", value: 7 }
];

const component1 = () => <Text style={styles.buttonText}>Back</Text>;
const component2 = () => <Text style={styles.buttonText}>Save & Continue</Text>;
const component3 = () => <Text style={styles.buttonText}>Skip</Text>;

export default class SurveyScreen extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,

      gender: global.user.meta.gender == 1 ? 0 : 1,
      rateAnswer: "",
      questionText: "",
      currentQuestionId: "",
      nextQuestion: "",
      perviousQuestion: "",
      loading: true,
      answer: null,
      answers: [],
      selectedMultiplyAnswer: [],
      commentText: "",
      commentLabel: null,
      isComment: false,
      isChecked: [],
      type: null
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    this.setState({ selectedIndex });
    this.fetchSection(selectedIndex);
  }
  fetchSection(index) {
    this.setState({ loading: true });
    if (index === 0) {
      this.perviousQuestion();
    }
    if (index === 1) {
      this.SaveAnswer();
    }
    if (index === 2) {
      this.skipQuestion();
    }
  }
  requestResponed = (request_id, decision) => {
    Api.photoRequestRespond(request_id, decision).then(res => {
      this.setupImpagination();
    });
  };

  perviousQuestion = () => {
    this.setState({ loading: true });

    const { perviousQuestion } = this.state;

    if (perviousQuestion) {
      this.currentQuestion(perviousQuestion);
    } else {
      this.setState({ loading: false });

      ToastAndroid.show("Can't go back", ToastAndroid.LONG);
    }
  };
  SaveAnswer = () => {
    this.setState({ loading: true });
    const { answer, currentQuestionId, rateAnswer, commentText } = this.state;
    Api.setSurveyAnswer(currentQuestionId, answer, rateAnswer, commentText)
      .then(data => {
        this.skipQuestion();
      })
      .catch(error => {
        Alert.alert("Error", error);
        this.setState({ loading: false });
      });
  };
  skipQuestion = () => {
    this.setState({ loading: true, isChecked: [], selectedMultiplyAnswer: [] });

    const { nextQuestion } = this.state;

    if (nextQuestion) {
      this.currentQuestion(nextQuestion);
    } else {
      this.setState({ loading: false });

      ToastAndroid.show("Can't go forward", ToastAndroid.LONG);
    }
  };
  currentQuestion = id => {
    const { gender } = this.state;

    Api.getSurveyQuestion(id)
      .then(data => {
        console.log(data);
        this.setState({ loading: false });
        this.setState({
          questionText: data.question.question,
          nextQuestion: data.next_id,
          currentQuestionId: data.question_id,
          perviousQuestion: data.previous_id,
          answers: data.question.answers[gender],
          commentLabel: data.question.comments,
          type: data.question.type
        });
      })
      .catch(error => {
        this.setState({ loading: false });
        Alert.alert("Error", error);
      });
  };
  componentDidMount() {
    this.currentQuestion(this.state.currentQuestionId);
  }
  onSelectionsChangeAnswer = selectedMultiplyAnswer => {
    this.setState({ selectedMultiplyAnswer });
  };

  isIconCheckedOrNot = (item, index) => {
    let { isChecked, selectedMultiplyAnswer } = this.state;
    isChecked[index] = !isChecked[index];
    this.setState({ isChecked: isChecked });
    if (isChecked[index] == true) {
      selectedMultiplyAnswer.push(item.value);
    } else {
      selectedMultiplyAnswer.pop(item.value);
    }

    this.setState({
      answer: selectedMultiplyAnswer.reduce((a, b) => a + b, 0)
    });
  };

  render() {
    const {
      questionText,
      answers,
      loading,
      commentLabel,
      commentText,
      selectedIndex,
      type
    } = this.state;
    const buttons = [
      { element: component1 },
      { element: component2 },
      { element: component3 }
    ];
    let answerslist = [];
    for (index in answers) {
      answerslist.push({ label: answers[index], value: Math.pow(2, index) });
    }
    if (loading == true) return <ActivityOverlay />;

    return (
      <React.Fragment>
        <CommonHeaderBack title={"Survey"} />
        <ScrollView style={{ backgroundColor: Colors.textColor }}>
          <Card
            containerStyle={{
              borderRadius: 8,
              flexDirection: "column"
            }}
          >
            <Text style={styles.textStyle}>Q: {questionText}</Text>

            {!type && (
              <RadioForm
                radio_props={answerslist}
                initial={-1}
                onPress={value => {
                  this.setState({ answer: value });
                }}
              />
            )}
            {type && (
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Text>(Choose all that apply)</Text>
                <FlatList
                  data={answerslist}
                  renderItem={item => (
                    <CheckBox
                      key={item.index}
                      containerStyle={{
                        borderWidth: 0,
                        backgroundColor: Colors.textColor
                      }}
                      textStyle={{ fontWeight: "400", color: "#000000" }}
                      title={item.item.label}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      checked={this.state.isChecked[item.index]}
                      onPress={() =>
                        this.isIconCheckedOrNot(item.item, item.index)
                      }
                    />
                  )}
                  keyExtractor={item => item.index}
                />
              </View>
            )}
            {commentLabel && (
              <View style={{ margin: 1 }}>
                <Text style={styles.textStyle}>{commentLabel}</Text>
                <TextInput
                  style={{
                    borderColor: "gray",
                    borderWidth: 1,
                    borderRadius: 8
                  }}
                  onChangeText={commentText => this.setState({ commentText })}
                  value={commentText}
                  editable={true}
                  multiline={true}
                />
              </View>
            )}
          </Card>

          <Card
            containerStyle={{
              backgroundColor: "#F9F1C6",
              borderRadius: 8,
              flexDirection: "column"
            }}
          >
            <Text style={[styles.textStyle, { color: "#8A6D3B" }]}>
              Rate IMPORTANCE Below:
            </Text>

            <RadioForm
              radio_props={rateAnswerslist}
              onPress={value => {
                this.setState({ rateAnswer: value });
              }}
            />
          </Card>
        </ScrollView>

        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          selectedButtonStyle={{ backgroundColor: Colors.mainAppColor }}
          containerStyle={{
            backgroundColor: Colors.mainAppColor,
            width: "100%",
            height: 50,
            marginLeft: 0,
            marginBottom: 0,
            marginTop: 0,
            borderWidth: 0,
            borderRadius: 0
          }}
        />
      </React.Fragment>
    );
  }
}

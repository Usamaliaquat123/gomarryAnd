import React from "react";
import { FlatList } from "react-native";
import { CheckBox } from "react-native-elements";

function MultiplyOption(props) {
  const { items, selectedItems } = props;
  let list = selectedItems;
  isIconCheckedOrNot = item => {
    const { value } = item;
    if (list.includes(value)) {
      list = list.filter(item => item !== value);
    } else {
      list.push(value);
    }

    props.onSelectionsChange(list, value);
  };
  return (
    <FlatList
      data={items}
      renderItem={item => (
        <CheckBox
          containerStyle={{
            borderWidth: 0,
            backgroundColor: "#FFF"
          }}
          textStyle={{ fontWeight: "300", color: "#000000" }}
          title={item.item.label}
          checked={selectedItems.includes(item.item.value)}
          onPress={() => this.isIconCheckedOrNot(item.item)}
        />
      )}
      keyExtractor={item => item.index}
    />
  );
}

export default MultiplyOption;

import React from "react";
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton
} from "react-native-popup-dialog";
import { Colors } from "../Themes";
import MultiplyOption from "./MultiplyOption";
List = name => {
  let list = [];
  for (let k in global.attributes) {
    if (k === name) {
      let attribute = global.attributes[k];
      for (var v in attribute.options) {
        var option = attribute.options[v];

        if (typeof option === "object") {
          for (var sv in option) {
            if (!option.hasOwnProperty(sv)) continue;
            var suboption = option[sv];
            list.push({ label: suboption, value: sv });
          }
        } else {
          list.push({ label: option, value: v });
        }
      }
      return list;
    }
  }
};
function DialogBox(props) {
  return (
    <Dialog
      visible={props.visible}
      dialogTitle={<DialogTitle title={props.name} />}
      footer={
        <DialogFooter>
          <DialogButton text="OK" onPress={() => props.changeVisible(false)} />
        </DialogFooter>
      }
      onTouchOutside={() => props.changeVisible(false)}
    >
      <DialogContent style={{ height: 500, width: 300 }}>
        <MultiplyOption
          items={this.List(props.name)}
          selectedItems={props.selectedItems}
          onSelectionsChange={props.onSelectionsChange}
        />
      </DialogContent>
    </Dialog>
  );
}

export default DialogBox;

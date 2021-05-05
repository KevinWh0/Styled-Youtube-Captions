//All the users style data
export let styleData = [];
//A setter for when we are loading in a existing project
export function setStyleData(data) {
  styleData = data;
}
//Font dictionary taken from: https://github.com/arcusmaximus/YTSubConverter/blob/3455abe39138348283bc12f9ad2f5b94e2115e61/YTSubConverter/Formats/YttDocument.cs#L1173
export const fontDictionary = {
  "-1": "Default",
  1: "Courier New", //works
  2: "Times New Roman", //works
  3: "Lucida Console", // Because of the incorrect "Deja Vu Sans Mono" font name in YouTube's captions.js, browsers fall back to this second option
  5: "Comic Sans Ms", // works
  6: "Monotype Corsiva", //seems to not work
  7: "Carrois Gothic Sc",
  _: "Roboto",
};

//Unused, might be used later if we add position support
export const positionDictornary = {
  BottomLeft: 1,
  BottomCenter: 2,
  BottomRight: 3,
  MiddleLeft: 4,
  Center: 5,
  MiddleRight: 6,
  TopLeft: 7,
  TopCenter: 8,
  TopRight: 9,
};

//all the styles that can be applied and what input type they will need to be modified along with some perams
const styleTypes = {
  backgroundColor: "color",
  color: "color",
  italics: "boolean",
  bold: "boolean",
  underline: "boolean",
  font: "dropdown " + JSON.stringify(fontDictionary),
  size: "number 100",
  backgroundOpacity: "numberRanged 0-255",
  fontOpacity: "numberRanged 0-255",
  "Dropshadow Color": "color",
  "Dropshadow Distance": "numberRanged 1-4",
};
//This is a table for convering the data into the correct varible names for youtube
export const styleToXML = {
  backgroundColor: "bc",
  color: "fc",
  italics: "i",
  bold: "b",
  underline: "u",
  font: "fs",
  size: "sz",
  backgroundOpacity: "bo",
  fontOpacity: "fo",
  id: "id",
  "Dropshadow Color": "ec",
  "Dropshadow Distance": "et",
};
//Default styling done below here in AddStyle

//This is the offset of what id we will start on when making new styles(start on 1 because 0 is for dealing with weird black edges)
let startingNumber = 1;

//Add the click listener to the addStyle button
document.getElementById("addStyle").addEventListener("click", () => {
  AddStyle();
});

export function AddStyle(overideText, data) {
  //Add the new style button to the list so they can edit the style
  let newStyleButton = document.createElement("button");
  newStyleButton.setAttribute("class", "styleButton");
  newStyleButton.innerHTML = styleData.length + startingNumber;
  //when they click the button show all the input fields for them to edit
  newStyleButton.onclick = function () {
    handleStyleSelect(newStyleButton);
  };
  //add the button to the styleButtons container
  document.getElementById("styleButtons").appendChild(newStyleButton);
  //if there was no custom data then we will set it
  if (data == undefined) {
    //Set the style to the default style
    data = {
      id: newStyleButton.innerHTML,
      backgroundColor: 0,
      color: "#ffffff",
      italics: -1,
      bold: -1,
      underline: -1,
      font: "-1",
      size: 100 /*%*/,
      backgroundOpacity: 0,
      fontOpacity: 255,
      "Dropshadow Color": 0,
      "Dropshadow Distance": 4,
    };
  }

  //add a default style to the styleData array.
  styleData.push(data);
  //if there is overideText then set the buttons text to its id + the text
  if (overideText != undefined) newStyleButton.innerHTML += " - " + overideText;
}

/**
 *
 * @param {HTMLButtonElement} button - the button that called this
 */
function handleStyleSelect(button) {
  //Deselect all the buttons so the color changes back
  deSelectButtonsInDiv(document.getElementById("styleButtons"));
  //Add the selected class to the clicked button so it turns red
  button.classList.add("selected");
  //get the id of the button
  let buttonID = Number(button.innerHTML.split(" ")[0]) - startingNumber;
  //get the current style data from the styleData list
  let style = styleData[buttonID];
  //Remove all previous elements from the style editor
  document.getElementById("styleEditor").innerHTML = "";

  //add all the required elements to the style editor so that they can modify the values
  for (let i = 0; i < Object.keys(style).length; i++) {
    //get all the active styles on this style (e.g. bold, underlined, color, ect)
    let styles = Object.keys(style)[i];
    let element;
    if (styleTypes[styles] == null) continue;
    //Generate all the input fields and set their starting values to the style data

    //if the current styletype is a boolean create a dropdown for it
    if (styleTypes[styles].includes("boolean")) {
      element = document.createElement("p");
      element.innerHTML = `${styles} : <select id="${styles}"><option ${
        style[styles] == -1 ? "selected" : ""
      } value="-1">Default</option>
      <option ${style[styles] == 1 ? "selected" : ""} value="1">True</option>
      <option ${
        style[styles] == 0 ? "selected" : ""
      } value="0">False</option></select>`;
      //If its a color make a color selector for it
    } else if (styleTypes[styles].includes("color")) {
      element = document.createElement("p");
      element.innerHTML = `${styles} : <input type="color" value="${
        style[styles] || 0
      }" id="${styles}" name="colPicker" value="#ff0000">`;
      //if its a ranged number add a ranged number input
    } else if (styleTypes[styles].includes("numberRanged")) {
      let args = styleTypes[styles].split(" ")[1].split("-");
      element = document.createElement("p");
      element.innerHTML = `${styles} : <input type="number" value="${
        style[styles] || 0
      }" id="${styles}" min="${Number(args[0]) - 1}" max="${Number(args[1])}">`;
      //if its an number make a number input field
    } else if (styleTypes[styles].includes("number")) {
      let args = styleTypes[styles].split(" ")[1];

      element = document.createElement("p");
      element.innerHTML = `${styles} : <input type="number" value="${
        style[styles] || args
      }" id="${styles}" >`;
      //if its a dropdown add a dropdown element
    } else if (styleTypes[styles].includes("dropdown")) {
      element = document.createElement("p");
      //Get the dropdown arguments
      let args = styleTypes[styles].split(" ");
      args[0] = "";
      args = JSON.parse(args.join(" "));
      let htmlData = "";
      //Read the dropdown arguments, and add the options
      for (let j = 0; j < Object.keys(args).length; j++) {
        let k = Object.keys(args)[j];
        htmlData += `<option ${
          style[styles] == k ? "selected" : ""
        } value="${k}">${args[k]}</option>`;
      }

      element.innerHTML = `${styles} : <select id="${styles}">${htmlData}</select>`;
    }
    //Add the element
    document.getElementById("styleEditor").appendChild(element);
    //add a onchange listener to update the styling data array when a value is changed
    element.addEventListener("change", (e) => {
      //The id (e.g. color, bold, underlined, ect)
      let id = e.target.id;
      //The new value
      let val = e.target.value;

      styleData[buttonID][id] = val;
    });
  }
}
//Deselects all the buttons in the specified div(removes the selected class)
function deSelectButtonsInDiv(div) {
  let innerHTMLComponents = div.getElementsByTagName("*");
  for (let i = 0; i < innerHTMLComponents.length; i++) {
    let elmnt = innerHTMLComponents[i];
    if (Array.from(elmnt.classList).includes("selected")) {
      elmnt.classList.remove("selected");
    }
  }
}
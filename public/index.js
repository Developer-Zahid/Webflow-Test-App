var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Function to prefill the textarea when an element is selected
function prefillTextarea(element) {
    return __awaiter(this, void 0, void 0, function* () {
        if (element) {
            try {
                if ((element === null || element === void 0 ? void 0 : element.textContent) && (element === null || element === void 0 ? void 0 : element.children)) {
                    // Get child elements
                    const children = yield element.getChildren();
                    // Filter string elements from children
                    const strings = children.filter(child => child.type === "String");
                    // Initialize an array to hold text content
                    let textContentArray = [];
                    // Loop over string elements to get text
                    for (const myString of strings) {
                        if (myString.type === "String") {
                            const text = yield myString.getText();
                            textContentArray.push(text);
                        }
                    }
                    // Join text content array into a single string
                    const textContent = textContentArray.join(' ');
                    // Set the textarea value to the selected element's text content
                    document.querySelector('[name="textarea"]').value = textContent;
                }
                else {
                    // Notify the user if no element with text content is selected
                    yield webflow.notify({ type: 'Error', message: "Please select an element that contains text." });
                }
            }
            catch (error) {
                // Handle any unexpected errors
                console.error('Error pre-filling the textarea:', error);
                yield webflow.notify({ type: 'Error', message: "An unexpected error occurred while pre-filling the textarea." });
            }
        }
        else {
            console.log('No element is currently selected.');
        }
    });
}
// Subscribe to changes in the selected element
const selectedElementCallback = (element) => {
    prefillTextarea(element);
};
const unsubscribeSelectedElement = webflow.subscribe('selectedelement', selectedElementCallback);
// Function to handle the form submission
document.getElementById("form").onsubmit = (event) => __awaiter(this, void 0, void 0, function* () {
    event.preventDefault();
    try {
        // Get the currently selected element again when the form is submitted
        const el = yield webflow.getSelectedElement();
        if (el && el.textContent !== undefined) {
            // Get the updated text from the textarea
            const updatedText = document.querySelector('[name="textarea"]').value;
            // Set the text content of the selected element to the updated text
            el.setTextContent(updatedText);
            // Notify the user that the text content was successfully updated
            yield webflow.notify({ type: 'Success', message: "Text content updated successfully." });
        }
        else {
            // Notify the user to select an element with text content
            yield webflow.notify({ type: 'Error', message: "Please select an element that contains text." });
        }
    }
    catch (error) {
        // Handle any unexpected errors
        console.error('Error updating text content:', error);
        yield webflow.notify({ type: 'Error', message: "An unexpected error occurred while updating the text content." });
    }
});
// document.getElementById("form").onsubmit = async (event) => {
//   event.preventDefault();
//   // Get the current selected Element
//   const el = await webflow.getSelectedElement();
//   if(el && el.textContent){
//     const currentText = document.querySelector('[name="textarea"]').value
//     el.setTextContent(currentText)
//   }
//   else {
//     await webflow.notify({type: 'Error', message: "Please select an element that contains text."})
//   }
// };

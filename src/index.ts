// Function to prefill the textarea when an element is selected
async function prefillTextarea(element: AnyElement | null) {
  if (element) {
    try {
      if (element?.textContent && element?.children) {
        // Get child elements
        const children = await element.getChildren();

        // Filter string elements from children
        const strings = children.filter(child => child.type === "String");

        // Initialize an array to hold text content
        let textContentArray: string[] = [];

        // Loop over string elements to get text
        for (const myString of strings) {
          if (myString.type === "String") {
            const text = await myString.getText();
            textContentArray.push(text);
          }
        }

        // Join text content array into a single string
        const textContent = textContentArray.join(' ');

        // Set the textarea value to the selected element's text content
        (document.querySelector('[name="textarea"]') as HTMLTextAreaElement).value = textContent;
      } else {
        // Notify the user if no element with text content is selected
        await webflow.notify({ type: 'Error', message: "Please select an element that contains text." });
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error pre-filling the textarea:', error);
      await webflow.notify({ type: 'Error', message: "An unexpected error occurred while pre-filling the textarea." });
    }
  } else {
    console.log('No element is currently selected.');
  }
}

// Subscribe to changes in the selected element
const selectedElementCallback = (element: AnyElement | null) => {
  prefillTextarea(element);
};

const unsubscribeSelectedElement = webflow.subscribe('selectedelement', selectedElementCallback);

// Function to handle the form submission
document.getElementById("form").onsubmit = async (event) => {
  event.preventDefault();

  try {
    // Get the currently selected element again when the form is submitted
    const el = await webflow.getSelectedElement();

    if (el && el.textContent !== undefined) {
      // Get the updated text from the textarea
      const updatedText = (document.querySelector('[name="textarea"]') as HTMLTextAreaElement).value;

      // Set the text content of the selected element to the updated text
      el.setTextContent(updatedText);

      // Notify the user that the text content was successfully updated
      await webflow.notify({ type: 'Success', message: "Text content updated successfully." });
    } else {
      // Notify the user to select an element with text content
      await webflow.notify({ type: 'Error', message: "Please select an element that contains text." });
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error updating text content:', error);
    await webflow.notify({ type: 'Error', message: "An unexpected error occurred while updating the text content." });
  }
};


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
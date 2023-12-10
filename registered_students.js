console.log('registered_students.js is executing...');

addEventListener('DOMContentLoaded', getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown);

const div_get_all_classes = document.getElementById("get_all_classes");

async function getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown(event)
{
    //prevent default form submission
    event.preventDefault();
    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/classes";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const listOfClassesAsJSON = await response.json();
            console.log({listOfClassesAsJSON});

            refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON);
        }
        else
        {
            div_get_all_classes.innerHTML = '<p class="failure">ERROR: failed get classes</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_get_all_classes.innerHTML = '<p class="failure">ERROR: failed to fetch data</p>';
    }

    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - END');
}


function refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON)
{
    const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");

    // delete all existing options (i.e., children) of the selectClassForEnrollment
    while (selectClassForEnrollment.firstChild)
    {
        selectClassForEnrollment.removeChild(selectClassForEnrollment.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a class";
    option.disabled = true;
    option.selected = true;
    selectClassForEnrollment.appendChild(option);

    for (const classAsJSON of listOfClassesAsJSON)
    {
        const option = document.createElement("option");
        option.value = classAsJSON.id;                              // this is the value that will be sent to the server
        option.text = classAsJSON.code + ": " + classAsJSON.title;  // this is the value the user chooses from the dropdown

        selectClassForEnrollment.appendChild(option);
    }
}

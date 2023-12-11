console.log('registered_students.js is executing...');

const id_form_add_new_student_to_a_class = document.getElementById("id_form_add_new_student_to_a_class");
id_form_add_new_student_to_a_class.addEventListener('submit', handleAddStudentToClassEvent);
const div_drop_student_from_class = document.getElementById("drop_student_from_class");

addEventListener('DOMContentLoaded', getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown);
addEventListener('DOMContentLoaded', getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown);

const table_list_of_registered_students = document.getElementById("list_of_registered_students");
const div_add_student_to_class = document.getElementById("add_student_to_class");

const div_fetch_students_status = document.getElementById("fetch_students_status");
const div_fetch_classes_status = document.getElementById("fetch_classes_status");


async function getAllRegisteredStudents () {
    console.log('getAllRegisterdStudents - START')

    API_URL = "http://localhost:8080/registered_students";

    table_list_of_registered_students.innerHTML = "Calling the API to get the list of students...";

    try {
        const response = await fetch(API_URL);
        console.log({response})
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            
            table_list_of_registered_students.innerHTML = "Retrieved registered students successfully, we just need to process them..."

            const listOfRegisteredStudents = await response.json();
            console.log({listOfRegisteredStudents});
            displayRegisteredStudents(listOfRegisteredStudents);
        }
        else {
            table_list_of_registered_students.innerHTML = `<tr><td> registered_students="failure">ERROR: failed to retrieve the registered_students.</td></tr>`;
        }
    }
    catch (error) {
        console.log(error);
        table_list_of_registered_students.innerHTML = `<tr><td> registered_students="failure">ERROR: failed to connect to the API to fetch the registered_students data.</td></tr>`;
    }
}

async function addStudentToClass(registered_student_data) {
    const API_URL = "http://localhost:8080/registered_students";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(registered_student_data)
        });
        console.log({response})
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const new_registered_student_entry = await response.json();
            div_add_student_to_class.innerHTML = `<p registered_student="success">Student added to the class successfully.  Student ${new_registered_student_entry.student_id} was registered to ${new_registered_student_entry.class_id}</p>`
            await getAllRegisteredStudents();
        }
        else {
            div_add_student_to_class.innerHTML = `<p registered_student="failure">ERROR: failed to add student to class</p>`;
        }
    }
    catch (error) {
        console.log(error);
        div_add_student_to_class.innerHTML = `<p registered_student="failure">ERROR: failed to connect to the API to add the student`;
    }
}

async function dropStudentFromClass (studentId, classId) {
    const API_URL = `http://localhost:8080/registered_students/${studentId}/${classId}`;
    try {
        const response = await fetch(API_URL, {method: "DELETE"});
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const deleted_registered_student_entry = await response.json();
            div_add_student_to_class.innerHTML = `<p registered_student="success">Student dropped from class successfully.  Student ${deleted_registered_student_entry.student_id} was dropped from ${deleted_registered_student_entry.class_id}</p>`
            await getAllRegisteredStudents();
        }
        else {
            div_add_student_to_class.innerHTML = `<p registered_student="failure">ERROR: failed to drop student from class</p>`;
        }
    }
    catch {
        div_add_student_to_class.innerHTML = `<p registered_student="failure>ERROR: failed to connect to the API to drop the student`;
    }
}

async function getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown()
{
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
            div_fetch_classes_status.innerHTML = '<p class="failure">ERROR: failed get classes</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_fetch_classes_status.innerHTML = '<p class="failure">ERROR: failed to fetch class data</p>';
    }

    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - END');
}

async function getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown () {
    const API_URL = "http://localhost:8080/students";

    try {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const listOfStudentsAsJSON = await response.json();
            console.log({listOfStudentsAsJSON});

            refreshTheSelectStudentForEnrollmentDropdown(listOfStudentsAsJSON);
        }
        else {
            div_fetch_students_status.innerHTML = '<p student="failure">ERROR: failed get students</p>';
        }
    }
    catch (error) {
        console.log(error);
        div_fetch_students_status.innerHTML = '<p class="failure">ERROR: failed to fetch student data</p>';
    }
}

// =====================================================================================================================
// Functions that update the HTML by manipulating the DOM
// =====================================================================================================================

async function handleAddStudentToClassEvent(event)
{
    // Prevent the default form submission behavior which will cause the page to be redirected to the action URL
    event.preventDefault();

    const formData = new FormData(id_form_add_new_student_to_a_class);
    const registered_student_data =
        {
            studentId: formData.get("studentId"),
            classId: formData.get("classId"),
        };
    console.log({registered_student_data});
    await addStudentToClass(registered_student_data);
}

function displayRegisteredStudents (listOfRegisteredStudentsAsJSON) {
    table_list_of_registered_students.innerHTML = `<tr>
                                                 <th>Student ID</th>
                                                 <th>Student Full Name</th>
                                                 <th>Class Code and Title</th>
                                                 <th></th>
                                                 </tr>`;

    for (var i = 0; i < listOfRegisteredStudentsAsJSON.length; i++) {
        table_list_of_registered_students.innerHTML += renderRegisteredStudentInHTML(listOfRegisteredStudentsAsJSON[i]);
    }
}

function renderRegisteredStudentInHTML (registeredStudentAsJSON) {
    return `<table>
        <tr data-studentId="${registeredStudentAsJSON.studentId}" data-classId="${registeredStudentAsJSON.classId}">
            <td>${registeredStudentAsJSON.studentId}</td>
            <td>${registeredStudentAsJSON.studentFullName}</td>
            <td>${registeredStudentAsJSON.code + " " + registeredStudentAsJSON.title}</td>
            <td>
                <button onclick="handleDropStudentFromClass(event)">Drop From Class</button>
            </td>
        </tr>
    </table>`;
}

async function handleDropStudentFromClass(event) {
    console.log('handleDropStudentFromClass - START');
    console.log(`event = ${event}`);
    console.log({event});
    //event.target is the button, then .parentElement accesses <td>
    const studentId = event.target.parentElement.parentElement.getAttribute("data-studentId");
    const classId = event.target.parentElement.parentElement.getAttribute("data-classId");
    const eventParentElement = event.target.parentElement;
    const eventTarget = event.target;
    console.log({eventParentElement});
    console.log({eventTarget});
    console.log({studentId});
    console.log({classId});
    await dropStudentFromClass(studentId, classId);
    console.log('handleDeleteStudentEvent - END');
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

function refreshTheSelectStudentForEnrollmentDropdown (listOfStudentsAsJSON) {
    const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");

    //delete the existing options
    while (selectStudentForEnrollment.firstChild)
    {
        selectStudentForEnrollment.removeChild(selectStudentForEnrollment.firstChild);
    }

    const option = document.createElement("option");
    //value of the option selected, for instance if select 2nd student, this would be set to "2"
    option.value = "";
    //text of the option, value that the user sees and chooses from list
    option.text = "Select a student";
    //doesn't allow user to select the option
    option.disabled = true;
    //if option is selected, the attribute will be set to true
    option.selected = true;
    //new option is appended to "selectStudentForEnrollment" as a child
    selectStudentForEnrollment.appendChild(option);

    //create a for loop that iterates over "listOfStudentsAsJSON"
    for (const studentAsJSON of listOfStudentsAsJSON)
    {
        //create an option variable that is not disabled, so they can be selected
        const option = document.createElement("option");
        //set the value to the studentId being displayed
        option.value = studentAsJSON.id;
        //set the text to the class code and title
        option.text = studentAsJSON.firstName;

        //append the values stored in option to the "selectStudentForEnrollment" element
        selectStudentForEnrollment.appendChild(option);
    }
}
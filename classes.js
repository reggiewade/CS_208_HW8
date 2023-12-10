console.log('classes.js is executing...');

//This JavaScript code retrieves an HTML element with the id "id_form_create_new_class" from the document.
const id_form_create_new_class = document.getElementById("id_form_create_new_class");
//Event listener will be triggered when the form is "submit".  The event listener will call the function handleCreateNewClassEvent.
id_form_create_new_class.addEventListener('submit', handleCreateNewClassEvent);

//Uses getElementById to retrieve the HTML elements with the id "create_new_class", "show_class_details", "update_class_details", "delete_class", and "list_of_classes" from the document.
const div_create_new_class = document.getElementById("create_new_class");
const div_show_class_details = document.getElementById("show_class_details");
const div_update_class_details = document.getElementById("update_class_details");
const div_delete_class = document.getElementById("delete_class");
const div_list_of_classes = document.getElementById("list_of_classes");


// // TODO: uncomment the following code to fetch and display the classes after the page loads
// document.addEventListener("DOMContentLoaded", async function()
// {
//     await getAndDisplayAllClasses();
// });


// =====================================================================================================================
// Functions that interact with the API
// =====================================================================================================================

async function createNewClass(classData)
{
    //set api url to http://localhost:8080/classes
    const API_URL = 'http://localhost:8080/classes';

    try
    {
        //set response to the result of the fetch function
        //set API_URL as the first parameter
        //set the second parameter to an object with method set to "POST" 
        //headers property set to a key-value pair of Content-Type and application/x-www-form-urlencoded
        //body property set to new URLSearchParams(classData), this creates a URL-encoded string representation of the data in the classData object, which will be sent as the request 
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(classData)
        });
        //logs entire response object
        console.log({response});
        //logs status of response (200, 404, etc.)
        console.log(`response.status = ${response.status}`);
        //logs status text of response (OK, Not Found, etc.)
        console.log(`response.statusText = ${response.statusText}`);
        //logs whether response is ok (true or false [boolean])
        console.log(`response.ok = ${response.ok}`);

        //checks if response is ok (200)
        if (response.ok)
        {
            //retrieves the JSON representation of the class that was created
            const createdClass = await response.json();
            //sets HTML content of "div_create_new_class" to a paragraph with class "success" and the id of the created class
            div_create_new_class.innerHTML = `<p class="success">Class created successfully. The new class id is ${createdClass.id}</p>`;
            //calls getAndDisplayAllClasses function
            await getAndDisplayAllClasses();
        }
        else
        {
            //sets HTML content of "div_create_new_class" to a paragraph with class "failure" and the text "ERROR: failed to create the new class"
            div_create_new_class.innerHTML = '<p class="failure">ERROR: failed to create the new class</p>';
        }
    }
    //catches and logs any errors that occur during the API call
    catch (error)
    {
        console.error(error);
        div_create_new_class.innerHTML = `<p class="failure">ERROR: failed to connect to the API to create the new class</p>`;
    }
}


async function getAndDisplayAllClasses()
{
    console.log('getAndDisplayAllClasses - START');

    //sete API_URL
    const API_URL = "http://localhost:8080/classes";

    //set HTML content of "div_list_of_classes" to "Calling the API to get the list of classes..."
    div_list_of_classes.innerHTML = "Calling the API to get the list of classes...";

    try
    {
        //set response to the result of the fetch function (default is GET)
        const response = await fetch(API_URL);
        //logs entire response object
        console.log({response});
        //logs status of response (200, 404, etc.)
        console.log(`response.status = ${response.status}`);
        //logs status text of response (OK, Not Found, etc.)
        console.log(`response.statusText = ${response.statusText}`);
        //logs whether response is ok (true or false [boolean])
        console.log(`response.ok = ${response.ok}`);

        //if response is ok (200)
        if (response.ok)
        {
            //sets HTML content of "div_list_of_classes" to "Retrieved the classes successfully, now we just need to process them..."
            div_list_of_classes.innerHTML = "Retrieved the classes successfully, now we just need to process them...";

            //retrieves the JSON representation of the list of classes
            const listOfClassesAsJSON = await response.json();
            //logs the JSON representation of the list of classes
            console.log({listOfClasses: listOfClassesAsJSON});

            //calls displayClasses function
            displayClasses(listOfClassesAsJSON);
        }
        //if response is not ok (404, etc.)
        else
        {
            div_list_of_classes.innerHTML = '<p class="failure">ERROR: failed to retrieve the classes.</p>';
        }
    }
    //catches and logs any errors that occur during the API call
    catch (error)
    {
        console.error(error);
        div_list_of_classes.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the classes data.</p>';
    }

    console.log('getAndDisplayAllClasses - END');
}


/**
 * @return the class with id = classId as JSON or null if the class could not be retrieved from the API
 */
async function getClass(classId)
{
    console.log(`getClass(${classId}) - START`);
    console.log("classId = " + classId);

    //set API_URL to http://localhost:8080/classes/classId
    const API_URL = "http://localhost:8080/classes/" + classId;

    console.log("Calling the API to get the class with id ${classId}...");
    try
    {
        //set response to the result of the fetch function
        const response = await fetch(API_URL);
        //logs entire response object
        console.log({response});
        //logs status of response (200, 404, etc.)
        console.log(`response.status = ${response.status}`);
        //logs status text of response (OK, Not Found, etc.)
        console.log(`response.statusText = ${response.statusText}`);
        //logs whether response is ok (true or false [boolean])
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            console.log("Retrieved the class successfully, now we just need to process it...");

            //retrieves the JSON representation of the class
            const classAsJSON = await response.json();
            console.log({classAsJSON});

            return classAsJSON;
        }
        //if response is not ok (404, etc.)
        else
        {
            console.log(`ERROR: failed to retrieve the class with id ${classId}`);
        }
    }
    //catches and logs any errors that occur during the API call
    catch (error)
    {
        console.error(error);
        console.log(`ERROR: failed to connect to the API to fetch the class with id ${classId}`);
    }
    //logs the classId
    console.log(`getClass(${classId}) - END`);

    // if this code is reached, it means that an error occurred and the class could not be retrieved
    return null;
}


async function updateClass(classData)
{
    //set API_URL to http://localhost:8080/classes/classData.id
    const API_URL = `http://localhost:8080/classes/${classData.id}`;

    try
    {
        //set response to the result of the fetch function
        //set API_URL as the first parameter
        //set the second parameter to an object with method set to "PATCH"
        //headers property set to a key-value pair of Content-Type and application/x-www-form-urlencoded
        //body property set to new URLSearchParams(classData), this creates a URL-encoded string representation of the data in the classData object, which will be sent as the request
        const response = await fetch(API_URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(classData)
        });
        //logs entire response object
        console.log({response});
        //logs status of response (200, 404, etc.)
        console.log(`response.status = ${response.status}`);
        //logs status text of response (OK, Not Found, etc.)
        console.log(`response.statusText = ${response.statusText}`);
        //logs whether response is ok (true or false [boolean])
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            //sets HTML content of "div_update_class_details" to a paragraph with class "success" and the text "Class updated successfully"
            div_update_class_details.innerHTML = '<p class="success">Class updated successfully</p>';
            //calls getAndDisplayAllClasses function (displays all classes)
            await getAndDisplayAllClasses();
        }
        //if response is not ok (404, etc.)
        else
        {
            div_update_class_details.innerHTML = '<p class="failure">ERROR: failed to update the class</p>';
        }
    }
    //catches and logs any errors that occur during the API call
    catch (error)
    {
        console.error(error);
        div_update_class_details.innerHTML = `<p class="failure">ERROR: failed to update the class with id ${classData.id}</p>`;
    }
}

async function deleteClass(classId)
{
    //set API_URL to http://localhost:8080/classes/classId
    const API_URL = `http://localhost:8080/classes/${classId}`;

    try
    {
        //set response to the result of the fetch function
        //set API_URL as the first parameter
        //set the second parameter to an object with method set to "DELETE"
        const response = await fetch(API_URL, {method: "DELETE"});
        //logs entire response object
        console.log({response});
        //logs status of response (200, 404, etc.)
        console.log(`response.status = ${response.status}`);
        //logs status text of response (OK, Not Found, etc.)
        console.log(`response.statusText = ${response.statusText}`);
        //logs whether response is ok (true or false [boolean])
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            //sets HTML content of "div_delete_class" to a paragraph with class "success" and the text "Class deleted successfully"
            div_delete_class.innerHTML = `<p class="success">Class with id ${classId} deleted successfully</p>`;
            //calls getAndDisplayAllClasses function (displays all classes)
            await getAndDisplayAllClasses();
        }
        //if response is not ok (404, etc.)
        else
        {
            div_delete_class.innerHTML = `<p class="failure">ERROR: failed to delete the class with id ${classId}</p>`;
        }
    }
    //catches and logs any errors that occur during the API call
    catch (error)
    {
        console.error(error);
        div_delete_class.innerHTML = `<p class="failure">ERROR: failed to connect to the API to delete the class with id ${classId}</p>`;
    }
}


// =====================================================================================================================
// Functions that update the HTML by manipulating the DOM
// =====================================================================================================================

async function handleCreateNewClassEvent(event)
{
    // Prevent the default form submission behavior which will cause the page to be redirected to the action URL
    event.preventDefault();

    //create new FormData object using id_form_create_new_class
    const formData = new FormData(id_form_create_new_class);
    //form data is extracted using formData.get("attributeName"), these are assigned to classData object
    const classData =
        {
            code: formData.get("code"),
            title: formData.get("title"),
            description: formData.get("description"),
            maxStudents: formData.get("maxStudents")
        };
    //print the classData object to the console
    console.log({classData});
    //call createNewClass function with classData object as parameter
    await createNewClass(classData);
}


function displayClasses(listOfClassesAsJSON)
{
    // clear the HTML content of the div, div_list_of_classes
    div_list_of_classes.innerHTML = '';

    // for each class in the list of classes, render it as HTML and append it to the div
    for (const classAsJSON of listOfClassesAsJSON)
    {
        console.log({classAsJSON});
        div_list_of_classes.innerHTML += renderClassAsHTML(classAsJSON);
    }
}


function renderClassAsHTML(classAsJSON)
{
    // data-id is a custom attribute that we use to store the id of the class, so that we can retrieve it later
    // when the user clicks on the "Show Class Details" button, or the "Update Class Details" button, or the "Delete Class" button

    //represents class information formatted in HTML
    return `<div class="show-class-in-list" data-id="${classAsJSON.id}">
        <p>Class ID (this is just for debugging): ${classAsJSON.id}</p>
        <p>Class code: ${classAsJSON.code}</p>
        <p>Class title: ${classAsJSON.title}</p>
        <p>Class description: ${classAsJSON.description}</p>
        <p>Max students: ${classAsJSON.maxStudents}</p>
        <p>
            <!-- TODO: this is for extra credit -->
            <a href="classes.show.html?class_id=${classAsJSON.id}">Show this class</a>
        </p>
        <button onclick="handleShowClassDetailsEvent(event)">Show Class Details</button>
        <button onclick="handleUpdateClassDetailsEvent(event)">Update Class Details</button>
        <button onclick="handleDeleteClassEvent(event)">Delete Class</button>
    </div>`;
}


async function handleShowClassDetailsEvent(event)
{
    console.log('handleShowClassDetailsEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const classId = event.target.parentElement.getAttribute("data-id");
    let classAsJSON = await getClass(classId);
    console.log({classAsJSON});
    if (classAsJSON == null)
    {
        div_show_class_details.innerHTML = `<p class="failure">ERROR: failed to retrieve the class with id ${classId}</p>`;
    }
    else
    {
        displayClassDetails(classAsJSON);
    }

    console.log('handleShowClassDetailsEvent - END');
}


function displayClassDetails(classAsJSON)
{
    console.log({classAsJSON});
    div_show_class_details.innerHTML = `<div class="show-class-details" data-id="${classAsJSON.id}">
        <p>Class ID (this is just for debugging): ${classAsJSON.id}</p>
        <p><strong>${classAsJSON.code}: ${classAsJSON.title}</strong></p>
        <p>Class description: ${classAsJSON.description}</p>
        <p>Max students: ${classAsJSON.maxStudents}</p>
    </div>`;
}


async function handleUpdateClassDetailsEvent(event)
{
    console.log('handleUpdateClassDetailsEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const classId = event.target.parentElement.getAttribute("data-id");
    const classAsJSON = await getClass(classId);
    console.log({classAsJSON});
    div_update_class_details.innerHTML =
        `<form id="id_form_update_class_details">
            <input type="hidden" name="id" value="${classAsJSON.id}">

            <label for="update_code">Class Code</label>
            <input type="text" name="code" id="update_code" value="${classAsJSON.code}" required>
            <br>

            <label for="update_title">Class Title</label>
            <input type="text" name="title" id="update_title" value="${classAsJSON.title}">
            <br>

            <label for="update_description">Class Description</label>
            <input type="text" name="description" id="update_description" value="${classAsJSON.description}">
            <br>

            <label for="update_max_students">Max students in class</label>
            <input type="number" name="maxStudents" id="update_max_students" value="${classAsJSON.maxStudents}">
            <br>

            <button type="submit">Update class details</button>
        </form>`;

    const idFormUpdateClassDetailsElement = document.getElementById("id_form_update_class_details");
    idFormUpdateClassDetailsElement.addEventListener("submit", function(event)
    {
        event.preventDefault();

        const formData = new FormData(idFormUpdateClassDetailsElement);
        const classData =
            {
                id: formData.get("id"),
                code: formData.get("code"),
                title: formData.get("title"),
                description: formData.get("description"),
                maxStudents: formData.get("maxStudents")
            };
        console.log({classData});
        updateClass(classData);
    });

    console.log('handleUpdateClassDetailsEvent - END');
}


async function handleDeleteClassEvent(event)
{
    console.log('handleDeleteClassEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const classId = event.target.parentElement.getAttribute("data-id");
    await deleteClass(classId);
    console.log('handleDeleteClassEvent - END');
}

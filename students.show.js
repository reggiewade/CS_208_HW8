console.log('students.show.js is executing...');

/**
 * This code is executed after the page loads.
 * If the URL of the page is
 *      students.show.html?student_id=123
 * then extract the student_id parameter and its value (i.e., 123) from the URL
 */
document.addEventListener("DOMContentLoaded", function ()
{
    const currentURL = new URL(window.location.href);
    console.log(`url = ${currentURL}`);

    const student_id = currentURL.searchParams.get("student_id");
    console.log(`student_id = ${student_id}`);

    document.getElementById("instructions_show_student_details").innerHTML=`
        <p>student_id extracted from the URL = ${student_id}</p>
        <h3>TODO EXTRA CREDIT</h3>
        <p>make a call to the API to retrieve the student with id ${student_id}</p>
        <p>
            display the content of the student retrieved from the API inside the 'students.show.html',
            inside the div with id="show_student_details"
        </p>
    `;
});
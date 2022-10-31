const getTableData = () => {
    fetch('json/details.json') 
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("tData", JSON.stringify(data));
    });
}
getTableData();

function listTables() {
    const tableData = JSON.parse(localStorage.getItem("tData"));

    let parent = document.getElementById("tableOfEmployees");
    
    tableData.forEach((rowData) => {
        let tableRow = document.createElement("tr");
        let skillRow = document.createElement("td");
        let buttonRow = document.createElement("td");
        let buttonDiv = document.createElement("div");
        let editBtn = document.createElement("button");
        let deleteBtn = document.createElement("button");
        
        tableRow.innerHTML = `<td>${rowData.employeeId}</td>
        <td>${rowData.employeeName}</td>
        <td>${rowData.designation}</td>
        <td>${rowData.dateOfBirth}</td>
        <td>${rowData.emailId}</td>`;
        
        rowData.skills.forEach((skillData) => {
            let spanTag = document.createElement("span");
                let length= rowData.skills.length ;
                console.log(length);
            (length-1) == rowData.skills.indexOf(skillData) ? 
            spanTag.innerHTML = skillData.skillName : 
            spanTag.innerHTML = `${skillData.skillName},`;

            skillRow.appendChild(spanTag);
        })

        editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        buttonDiv.setAttribute("class","buttonBox");
        editBtn.setAttribute("class","editButton");
        deleteBtn.setAttribute("class","deleteButton");

        tableRow.appendChild(skillRow);
        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(deleteBtn);
        buttonRow.appendChild(buttonDiv);
        tableRow.appendChild(buttonRow);
        parent.appendChild(tableRow);
    });
}
listTables();

const getFromLocalStorage = (keyName) => {
    return localStorage.getItem(keyName);
}

let tableData = JSON.parse(getFromLocalStorage("tData"));
let skillData = JSON.parse(getFromLocalStorage("sData"));
let modal = document.getElementById("addModal");
let submitBtn = document.getElementById("modalButton");
let deleteModal = document.getElementById("deleteModal");
let skillInput = document.getElementById("skills");
let autoSuggestion = document.getElementById("autoSuggestion");
let skillInputBox = document.getElementById("skillInputBox");
let addForm = document.getElementById("addForm");
let spanSkill;
let heading = document.getElementById("popUpHeader");
let skillArray = [];
let tempSKills = [];
const tableRows = document.getElementsByTagName("tr");
const deleteKey = "del";
const editKey = "edt";
let action = [];

skillInput.addEventListener("input", (e) => {
    tempSKills = [];
    if (e.target.value !== "") {
        const similarSkill = skillData.filter(({ skill }) => skill.toLowerCase().startsWith(e.target.value.toLowerCase()));
        autoSuggestion.innerHTML = "";
        similarSkill.forEach(({ skill, skillId }) => {
            let div = document.createElement("div");
            div.innerHTML = skill;
            div.setAttribute("id", skillId);
            div.setAttribute("class", "option");
            div.onclick = (element) => {
                if (!(tempSKills.includes(element.target.innerHTML))) {
                    tempSKills.push(element.target.innerHTML);
                    addEmployeeSkill(element);
                    skillInputBox.prepend(spanSkill);
                    skillInput.value = "";
                    autoSuggestion.style.display = "none";
                }
            }
            autoSuggestion.appendChild(div);
        })
        autoSuggestion.style.display = "block";
    }
    else {
        autoSuggestion.style.display = "none";
    }
})

function addEmployeeSkill(element) {
    let skillElem = {
        skillName: element.target.innerHTML,
        skillId: element.target.id
    };
    skillArray.push(skillElem);
    spanSkill = document.createElement("span");
    let crossIcon = document.createElement("i");
    spanSkill.innerHTML = element.target.innerHTML;
    spanSkill.setAttribute("class", "addSkillSpan");
    spanSkill.setAttribute("id", element.target.innerHTML)
    crossIcon.setAttribute("class", "fa-solid fa-xmark");
    crossIcon.setAttribute("id", element.target.id);
    spanSkill.appendChild(crossIcon);
    crossIcon.addEventListener("click", (element) => {
        removeSkill(element);
    })
}

function removeSkill(skill) {
    const skillArrayCopy = JSON.parse(JSON.stringify(skillArray));
    skillArrayCopy.forEach(({ skillId, skillName }, i) => {
        if (skill.target.id === skillId) {
            skillArrayCopy.splice(i, 1);
            const skillToRemove = document.getElementById(skillName);
            skillToRemove.remove();
        }
    })
    skillArray = skillArrayCopy;
}

function skillSuggestion() {
    const parent = document.getElementById("skillSuggestion");
    let skillNames = JSON.parse(localStorage.getItem("sData"));
    skillNames.forEach((skillObj) => {
        let options = document.createElement("option");
        options.innerHTML = skillObj.skill;
        options.setAttribute("id", skillObj.skillId);
        parent.appendChild(options);
    })
}

function skillReset() {
    document.querySelectorAll(".addSkillSpan").forEach(span => {
        span.remove();
    })
}

submitBtn.addEventListener("click", () => {
    const empId = document.getElementById("empId").value;
    const empName = document.getElementById("empName").value;
    const dsgn = document.getElementById("dsgn").value;
    const dob = document.getElementById("dob").value;
    const mail = document.getElementById("mailid").value;
    if (empId == "" || empName == "" || dsgn == "" || dob == "" || mail == "") {
        alert("Enter all input fields");
    }
    else {
        let isValidMail = mailValidation(mail);
        if (isValidMail) {
            if (heading.innerHTML === "Add Employee Details") {
                let employee = {
                    employeeId: empId,
                    uuid: new Date().getMilliseconds() * Math.random().toString(),
                    employeeName: empName,
                    designation: dsgn,
                    dateOfBirth: dob,
                    emailId: mail,
                    skills: []
                }
                skillArray.forEach((skillElement) => {
                    let skillObject = {
                        skillName: skillElement.skillName,
                        skillId: skillElement.skillId
                    }
                    employee.skills.push(skillObject);
                })
                modal.style.display = "none";
                addForm.reset();
                skillReset();
                addEmployeeData(employee);
            }
            else if (heading.innerHTML === "Update Employee Details") {
                const id = action[1];
                tableData.forEach((rowData) => {
                    if (id == rowData.uuid) {
                        rowData.employeeId = document.getElementById("empId").value;
                        rowData.employeeName = document.getElementById("empName").value;
                        rowData.designation = document.getElementById("dsgn").value;
                        rowData.dateOfBirth = document.getElementById("dob").value;
                        rowData.emailId = document.getElementById("mailid").value;
                        rowData.skills = [];
                        skillArray.forEach((skillElement) => {
                            let skillObject = {
                                skillName: skillElement.skillName,
                                skillId: skillElement.skillId
                            }
                            rowData.skills.push(skillObject);
                        })
                        localStorage.setItem("tData", JSON.stringify(tableData));
                        for (row of tableRows) {
                            if (id === row.id) {
                                for (child of row.children) {
                                    const fieldType = child.id.split("-")[0];
                                    switch (fieldType) {
                                        case "empId":
                                            child.innerHTML = empId;
                                            break;
                                        case "empName":
                                            child.innerHTML = empName;
                                            break;
                                        case "desgtn":
                                            child.innerHTML = dsgn;
                                            break;
                                        case "dob":
                                            child.innerHTML = dob;
                                            break;
                                        case "emailId":
                                            child.innerHTML = mail;
                                            break;
                                        case "skill":
                                            child.innerHTML = '';
                                            skillArray.forEach((element) => {
                                                (skillArray.length - 1) == skillArray.indexOf(element.skillName) ?
                                                    child.innerHTML += `<span>${element.skillName}</span>` :
                                                    child.innerHTML += `<span>${element.skillName} </span>`;
                                            })
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                        }
                    }
                })
                modal.style.display = "none";
                skillReset();
                skillArray = [];
            }
        }
    }
})

const getTableData = () => {
    fetch('json/details.json')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length) {
                localStorage.setItem("tData", JSON.stringify(data));
                tableData = JSON.parse(getFromLocalStorage("tData"));
                sortTable();
                listTables();
            }
            else {
                alert("no data");
            }
        })
        .catch(error => {
            let parent = document.getElementById("tableSection");
            let div = document.createElement("div");
            let span = document.createElement("span");
            span.innerHTML = `Error. Data not found`;
            div.setAttribute("class", "errorDiv");
            div.appendChild(span)
            parent.appendChild(div);
        })
}

const getSkillData = () => {
    fetch('json/skills.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("sData", JSON.stringify(data));
            skillSuggestion();
        })
}

initData();

function initData() {
    const data = JSON.parse(getFromLocalStorage("tData"));
    if (!data || data.length === 0) {
        getTableData();
    }
    else {
        sortTable();
        listTables();
    }
    getSkillData();
    addModal();
    updateButton();
    deleteButton();
    filter();
}

function listTables() {
    let parent = document.getElementById("tableBody");
    tableData.forEach((rowData) => {
        const tableRow = document.createElement("tr");
        tableRow.setAttribute("id", rowData.uuid)
        const skillRow = document.createElement("td");
        skillRow.setAttribute("id", `skill-${rowData.uuid}`)
        const buttonRow = document.createElement("td");
        const buttonDiv = document.createElement("div");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        tableRow.innerHTML = `<td id=empId-${rowData.uuid}>${rowData.employeeId}</td>
        <td id=empName-${rowData.uuid}>${rowData.employeeName}</td>
        <td id=desgtn-${rowData.uuid}>${rowData.designation}</td>
        <td id=dob-${rowData.uuid}>${rowData.dateOfBirth}</td>
        <td id=emailId-${rowData.uuid}>${rowData.emailId}</td>`;

        rowData.skills.forEach((skillData) => {
            const spanTag = document.createElement("span");
            spanTag.setAttribute("class", "skillSpan");
            const length = rowData.skills.length;

            (length - 1) == rowData.skills.indexOf(skillData) ?
                spanTag.innerHTML = skillData.skillName :
                spanTag.innerHTML = `${skillData.skillName},`;

            skillRow.appendChild(spanTag);
        })
        editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square" id=${editKey}-${rowData.uuid}></i>`;
        deleteBtn.innerHTML = `<i class="fa-solid fa-trash" id=${deleteKey}-${rowData.uuid}></i>`;

        buttonDiv.setAttribute("class", "buttonBox");
        buttonDiv.addEventListener("click", (event) => {
            action = event.target.id.split("-");
            if (action[0] === editKey) {
                heading.innerHTML = `Update Employee Details`;
                updateEmployee(action[1]);
            }
            else if (action[0] === deleteKey) {
                deleteEmployee(action[1]);
            }
        })
        editBtn.setAttribute("class", "editButton");
        deleteBtn.setAttribute("class", "deleteButton");

        tableRow.appendChild(skillRow);
        buttonDiv.appendChild(editBtn);
        buttonDiv.appendChild(deleteBtn);
        buttonRow.appendChild(buttonDiv);
        tableRow.appendChild(buttonRow);
        parent.appendChild(tableRow);
    });
}

function addModal() {
    let addButton = document.getElementById("addButton");
    let span = document.getElementById("addClose");
    let cancelButton = document.getElementById("cancelButton");
    addButton.onclick = () => {
        addForm.reset();
        let heading = document.getElementById("popUpHeader");
        heading.innerHTML = `Add Employee Details`;
        modal.style.display = "block";
    }
    span.onclick = () => {
        modal.style.display = "none";
        skillReset();
        addForm.reset();
        tempSKills = [];
    }
    cancelButton.onclick = () => {
        modal.style.display = "none";
        skillReset();
        addForm.reset();
        tempSKills = [];
    }
}

function addEmployeeData(rowData) {
    tableData.push(rowData);
    localStorage.setItem("tData", JSON.stringify(tableData));
    let parent = document.getElementById("tableBody");
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("id", rowData.uuid)
    const skillRow = document.createElement("td");
    skillRow.setAttribute("id", `skill-${rowData.uuid}`)
    const buttonRow = document.createElement("td");
    const buttonDiv = document.createElement("div");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    tableRow.innerHTML = `<td id=empId-${rowData.uuid}>${rowData.employeeId}</td>
        <td id=empName-${rowData.uuid}>${rowData.employeeName}</td>
        <td id=desgtn-${rowData.uuid}>${rowData.designation}</td>
        <td id=dob-${rowData.uuid}>${rowData.dateOfBirth}</td>
        <td id=emailId-${rowData.uuid}>${rowData.emailId}</td>`;

    rowData.skills.forEach((skillData) => {
        const spanTag = document.createElement("span");
        spanTag.setAttribute("class", "skillSpan");
        const length = rowData.skills.length;
        (length - 1) == rowData.skills.indexOf(skillData) ?
            spanTag.innerHTML = skillData.skillName :
            spanTag.innerHTML = `${skillData.skillName},`;
        skillRow.appendChild(spanTag);
    })

    editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square" id=${editKey}-${rowData.uuid}></i>`;
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash" id=${deleteKey}-${rowData.uuid}></i>`;

    buttonDiv.setAttribute("class", "buttonBox");
    buttonDiv.addEventListener("click", (event) => {
        action = event.target.id.split("-");
        if (action[0] === "edt") {
            let heading = document.getElementById("popUpHeader");
            heading.innerHTML = `Update Employee Details`;
            updateEmployee(action[1]);
        }
        else if (action[0] === "del") {
            deleteEmployee(action[1]);
        }
    })
    editBtn.setAttribute("class", "editButton");
    deleteBtn.setAttribute("class", "deleteButton");

    tableRow.appendChild(skillRow);
    buttonDiv.appendChild(editBtn);
    buttonDiv.appendChild(deleteBtn);
    buttonRow.appendChild(buttonDiv);
    tableRow.appendChild(buttonRow);
    parent.appendChild(tableRow);
}

function mailValidation(mailVal) {
    let atSymbol = mailVal.indexOf("@");
    let dot = mailVal.lastIndexOf(".");

    if (atSymbol < 1) {
        alert("Enter valid email id");
        return false;
    }
    else if (dot <= atSymbol + 2) {
        alert("Enter valid email id");
        return false;
    }
    else if (dot === mailVal.length - 1) {
        alert("Enter valid email id");
        return false;
    }
    else {
        return true;
    }
}

function updateButton() {
    let close = document.getElementById("addClose");
    close.onclick = () => {
        modal.style.display = "none";
        skillReset();
        tempSKills = [];
    }
    modal.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            skillReset();
            tempSKills = [];
        }
    })
}


function updateEmployee(id) {
    let skillUpdateBox = document.getElementById("skillInputBox");
    skillArray = [];
    tableData.forEach((rowData) => {
        if (id == rowData.uuid) {
            document.getElementById("empId").value = rowData.employeeId;
            document.getElementById("empName").value = rowData.employeeName;
            document.getElementById("dsgn").value = rowData.designation;
            document.getElementById("dob").value = rowData.dateOfBirth;
            document.getElementById("mailid").value = rowData.emailId;

            skillArray = JSON.parse(JSON.stringify(rowData.skills));
            skillArray.forEach(skillELement => {
                let spanSkill = document.createElement("span");
                let crossIcon = document.createElement("i");
                spanSkill.innerHTML = skillELement.skillName;
                spanSkill.setAttribute("class", "addSkillSpan");
                spanSkill.setAttribute("id", skillELement.skillName);
                crossIcon.setAttribute("class", "fa-solid fa-xmark");
                crossIcon.setAttribute("id", skillELement.skillId);
                spanSkill.appendChild(crossIcon);
                crossIcon.addEventListener("click", (element) => {
                    removeSkill(element);
                })
                skillUpdateBox.prepend(spanSkill);
            })
        }
    })
    modal.style.display = "block";
}

function deleteButton() {
    let noBtn = document.getElementById("deleteNo");
    let yesBtn = document.getElementById("deleteYes");
    let deleteClose = document.getElementById("deleteClose");
    deleteClose.onclick = () => {
        deleteModal.style.display = "none";
    }
    noBtn.onclick = () => {
        deleteModal.style.display = "none";
    }
    yesBtn.onclick = () => {
        deleteModal.style.display = "none";
    }
    deleteModal.addEventListener("click", (event) => {
        if (event.target == modal) {
            deleteModal.style.display = "none";
        }
    })
}

function deleteEmployee(id) {
    let deleteBtn = document.getElementById("deleteYes");
    deleteBtn.addEventListener("click", () => {
        tableData.forEach((rowData) => {
            if (id == rowData.uuid) {
                const index = tableData.indexOf(rowData);
                tableData.splice(index, 1);
                localStorage.setItem("tData", JSON.stringify(tableData));
                for (row of tableRows) {
                    if (id === row.id) {
                        row.remove();
                    }
                }
            }
        });
    })
    deleteModal.style.display = "block";
}

function sortTable() {
    let sortSelect = document.getElementById("sortButton");
    let value = sortSelect.value;
    checkSelect();
    sortSelect.addEventListener("change", checkSelect);
    function checkSelect() {
        value = sortSelect.value;
        value === "empIdSort" ? sortById() : sortByName();
    }
}

function sortById() {
    tableData.sort((a, b) => {
        return a.employeeId - b.employeeId;
    });
    localStorage.setItem("tData", JSON.stringify(tableData));
    tableReload();
}

function sortByName() {
    tableData.sort((a, b) => {
        let ea = a.employeeName.toLowerCase(),
            eb = b.employeeName.toLowerCase();
        if (ea < eb) {
            return -1;
        }
        if (ea > eb) {
            return 1;
        }
        return 0;
    });
    localStorage.setItem("tData", JSON.stringify(tableData));
    tableReload();
}

function tableReload() {
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    // while (tableBody.firstChild) {
    //     tableBody.removeChild(tableBody.firstChild);
    // }
    listTables();
}

function filter() {
    let filterButton = document.getElementById("filterButton");
    filterButton.addEventListener("keyup", () => {
        filterTable(filterButton.value);
    })
}

function filterTable(value) {
    let rows = document.querySelectorAll("#tableBody tr");
    rows.forEach((row) => {
        let skillSpan = row.getElementsByClassName("skillSpan");
        let isAvailable = false;
        for (span of skillSpan) {
            span.textContent.toLowerCase().startsWith(value.toLowerCase()) && (isAvailable = true)
        }
        isAvailable ? (row.style.display = "") : (row.style.display = "none");
    })
}
















